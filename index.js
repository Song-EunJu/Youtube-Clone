const express = require('express'); // express 모듈을 가져옴
const app = express() // 새로운 express 앱을 생성 
const port = 5001
const config = require('./config/key');
const { User } = require("./models/User"); // models 에서 생성한 User model 을 가져온다

// application/x-www-form-urlencoded 

//app.use(bodyParser.urlencoded({extended: true})); -> express 업데이트 후 body-parser 를 안가져와도 됨
app.use(express.urlencoded({extended:true}));

// application/json
app.use(express.json());
// app.use(bodyParser.json());


const mongoose = require('mongoose')
mongoose.connect(config.mongoURI,{
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


// 루트 디렉토리에 오면 hello world 출력
app.get('/', (req, res) => { 
  res.send('Hello World!asdfasf')
})

app.post('/register', (req, res) => {
  // 회원가입할 때 필요한 정보를 client 에서 가져오면 데이터베이스에 넣어줌
  const user = new User(req.body);
  /*
    req.body 안에 이런식으로 들어있는 거임
    {
      id:"hello",
      password:"123"
    } 
  */
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})