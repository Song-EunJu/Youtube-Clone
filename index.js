const express = require('express') // express 모듈을 가져옴
const app = express() // 새로운 express 앱을 생성 
const port = 5001

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://jd06280:thddmswn99@cluster0.biuf3.mongodb.net/youtube-clone?retryWrites=true&w=majority',{
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


// 루트 디렉토리에 오면 hello world 출력
app.get('/', (req, res) => { 
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})