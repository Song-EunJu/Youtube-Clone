const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10

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

    if(user.isModified('password')){ // password가 변경될 때만 처리
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
    
}) // index.js 에서 user 모델을 저장하기 전에 어떤 동작을 한다.

const User = mongoose.model('User', userSchema) 
module.exports = { User } // 다른 곳에서도 사용할 수 있도록 module화를 해준다