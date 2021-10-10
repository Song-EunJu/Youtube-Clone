const express = require('express'); // express 모듈을 가져옴
const app = express() // 새로운 express 앱을 생성 
const config = require('./server/config/key');
const cookieParser = require('cookie-parser')
const { auth } = require('./server/middleware/auth'); // mdidle ware에서 생성한 auth 를 가져와서 아래 middleware로 사용

const { User } = require("./server/models/User"); // models 에서 생성한 User model 을 가져온다

// application/x-www-form-urlencoded 

//app.use(bodyParser.urlencoded({extended: true})); -> express 업데이트 후 body-parser 를 안가져와도 됨
app.use(express.urlencoded({extended:true}));

// application/json
app.use(express.json());
// app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


// 루트 디렉토리에 오면 hello world 출력
app.get('/', (req, res) => { 
  res.send('Hello World!asdfasf')
})

app.get('/api/hello', (req, res) => {
  /* 원래는 받은 정보로 (request)로 뭔가 가공처리해서 response로 돌려줌 */
  res.send("안녕하세요")
})


app.post('/api/users/register', (req, res) => {
  // 회원가입할 때 필요한 정보를 client 에서 가져오면 데이터베이스에 넣어줌
  const user = new User(req.body);
  
  user.save((err, doc) => { // mongodb에서 오는 method
    if(err)
      return res.json({
        success: false, err
      })
    else
      return res.status(200).json({
        success:true
      }) // status(200) : 성공했다는 뜻
  });
})

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일이 DB에 있는지 찾는다
  User.findOne({ email : req.body.email }, (err, user) => {
    if(!user){ 
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    // 요청된 이메일이 DB에 있다면 비밀번호가 맞는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if(!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다."
        })

      // 비밀번호가 같으면 Token 생성
      user.generateToken((err, user) => {
        if(err)
          return res.status(400).send(err);

        /* 토큰을 저장한다. 어디에? 쿠키, 로컬스토리지 저장 가능
           이 강의에서는 쿠키 사용 -> 쿠키파서 깔아야 함
        */
        res.cookie("x_auth", user.token)
        .status(200)
        .json({
          loginSuccess: true,
          userId: user._id
        })
      })
    })
  })
})

app.get('/api/users/auth', auth, (req,res) => {
  // 여기까지 middleware를 통과해 왔다는 건 Authentication = True 라는 뜻
  res.status(200).json({
    _id : req.user._id, // auth.js 에서 req.user=user; 를 해줬기 때문
    isAdmin: req.user.role === 0 ? false : true,
    isAuth:true,
    email: req.user.email,
    name: req.user.name,
    lastname : req.user.lastname,
    role : req.user.role,
    image : req.user.image
  }) // client에 user 정보를 전달해주면 됨
})
// callback function (req,res) 를 하기 전에 중간에서 무언가 작업을 하는 것 

app.get('/api/users/logout', auth, (req, res) => {
  // middleware에서 가져와 찾은 다음에 
  User.findOneAndUpdate({_id: req.user._id},{token: ""},(err, user) => {
    if(err)
      return res.json({
        success: false,
        err
      });
    return res.status(200).send({
      success: true
    })
  })
})


const port = 5001

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})