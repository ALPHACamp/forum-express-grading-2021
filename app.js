const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const app = express()
const port = 3000

// template engine
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extented: true }))

// setup session and flash message
app.use(session({
  secret: 'MySecret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app  //app測試環境用
