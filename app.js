const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const bodyParser = require('body-parser')// Express 升級到了 4.17.1 之後，不用額外載入 body-parser，這行程式碼便不用寫
const db = require('./models') // 引入資料庫
const app = express()
const port = 3000


app.engine('handlebars', handlebars({ defaultLayout: 'main' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由

require('./routes')(app)

module.exports = app
