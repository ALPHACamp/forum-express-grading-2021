const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const flash = require('connect-flash')
const helpers = require('./_helpers')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const session = require('express-session')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

// 設定:樣板引擎
app.engine('hbs', exphbs({ 
  defaultLayout: 'main', 
  extname: '.hbs',
  helpers: require('./config/handlebars-helpers') 
}))
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({extended: true}))
// setup session
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
// setup passport
app.use(passport.initialize())
app.use(passport.session())
// setup flash
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))

// 把 req.flash 放到 res.locals 裡面
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
