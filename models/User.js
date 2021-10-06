const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true, //space 없애줌
        unique:1
    },
    password:{
        type:String,
        minlength:5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{ // 일반 유저와 관리자 분리
        type:Number,
        default:0
    },
    image:String,
    token:{ // 유효성 검사
        type:String
    },
    tokenExp:{ // 토큰의 유효기간
        type:Number
    }
})
userSchema.pre('save', function(next){
    var user = this; // userSchema 를 가리키고 있는 것

    // 이름이든 이메일이든 어떤 값을 변경할 때마다 매번 비밀번호를 암호화 처리하게 됨
    if(user.isModified('password')){ // password가 변경될 때만 암호화해야 함
        // 비밀번호 암호화
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err)
                return next(err) // next 하면 index.js 의 user.save()로 바로 넘어감
            bcrypt.hash(user.password, salt, function(err, hash){ // hash - 암호화 된 비밀번호
                if(err)
                    return next(err)
                user.password = hash
                next()
            })
        })      
    } 
    else{ // 비밀번호가 아니라 다른 항목을 바꾼 경우에는 그냥 나가기
        next();
    }
}) // index.js 에서 user 모델을 저장하기 전에 어떤 동작을 한다.


userSchema.methods.comparePassword = function(plainPassword, cb) {
    /* 
        plain : 1234567 / 암호화된 비밀번호 : 어쩌구저쩌구 
        plain을 암호화한 다음에 암호화된 비밀번호랑 같은지 체크해야 함
    */
    bcrypt.compare
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err)
            return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;

    // json web token 이용해서 토큰 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    // user._id + 'secretToken' = token 생성

    user.token = token
    user.save(function(err,user){
        if(err)
            return cb(err)
        cb(null, user)
    })
}

// cb = (err, user)의 콜백함수 
userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    

    // 토큰을 decode 한다
    jwt.verify(token, 'secretToken', function(err, decoded) { 
        // secretToken 이라는 문자열을 더해서 token을 더해서 문자열을 만들었기에 decoded 된거에는 user._id만 들어있음
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        user.findOne({"_id" : decoded, "token":token}, function(err, user){
            if(err)
                return cb(err);
            cb(null,user)
        })
        // 클라이언트에서 가져온 token 과 DB에 보관된 토큰이 일치하는지 확인
    });
}




const User = mongoose.model('User', userSchema) 
module.exports = { User } // 다른 곳에서도 사용할 수 있도록 module화를 해준다