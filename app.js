const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models') //引入資料庫
const app = express()
const port = 3000

//設定樣板引擎
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
