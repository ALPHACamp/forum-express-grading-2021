const express = require('express')
const exhbs = require('express-handlebars')

const app = express()
const port = 3000

// 設定 view engine 使用 handlebars
app.engine('hbs', exhbs({
  defaultLayout: 'main',
  extname: 'hbs',
}))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)

module.exports = app
