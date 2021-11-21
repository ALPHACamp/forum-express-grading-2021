const express = require('express')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const { engine } = require('express-handlebars')
const db = require('./models') // 引入資料庫
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())

app.engine('handlebars', engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars')

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app