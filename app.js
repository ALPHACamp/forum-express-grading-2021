const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const port = 3000

// 套件相關settings
app.engine('hbs', handlebars({ defaultLayout: 'main', extname: '.hbs' })) // Handlebars 註冊樣板引擎
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
