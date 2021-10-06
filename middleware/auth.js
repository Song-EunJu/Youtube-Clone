const { User } = require("../models/User");

let auth = (req, res, next) => {
    // 인증처리

    // 1. 클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookies.x_auth;
    // 2. 토큰을 복호화한 후 유저를 찾는다
    User.findByToken(token, (err, user) => {
        if(err)
            throw err
        
        if(!user)
            return res.json({
                isAuth: false,
                error: true
            })

        /* 아래 두 문장이 있는 이유 index.js 에서도 똑같은 방식으로 변수에 접근하여 사용가능*/
        req.token = token;
        req.user = user;
        next(); // index.js파일에서 - middleware에서 다음으로 넘어갈 수 있도록 ((req,res))이부분으로)

    })

    // 3. 유저가 있으면 인증 o 

    // 유저가 없으면 인증 no

}

module.exports = { auth };