const express = require('express')
const handlebars = require('express-handlebars');
const db = require('./models') // 引入資料庫
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const port = 3000


// 設定 view engine 使用 handlebars
app.engine('hbs', handlebars({defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

//body-parser
app.use(express.urlencoded({extended: true}))

// setup passport
// setup session
app.use(passport.initialize())
app.use(passport.session())

// setup session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())


// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// 把 passport 傳入 routes
require('./routes')(app, passport) 
// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)

module.exports = app
