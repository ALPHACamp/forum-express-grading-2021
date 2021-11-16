const express = require('express')
const exhbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const helpers = require('./_helpers')
const passport = require('./config/passport')
const db = require('./models')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const app = express()
const port = process.env.PORT || 3000

// 設定 view engine 使用 handlebars
app.engine('hbs', exhbs({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: require('./config/handlebars-helper')
}))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use('/upload', express.static(__dirname + '/upload'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req) // 取代 req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app, passport)

module.exports = app
