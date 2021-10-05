const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema) 
module.exports = { User } // 다른 곳에서도 사용할 수 있도록 module화를 해준다