const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const app = express()
const port = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

app.engine('hbs', exphbs({extname: '.hbs'}))
app.set('view engine', 'hbs')

// set body-parser
app.use(express.urlencoded({extended: true}))

// 我們需要用到「快閃訊息 (flash message)」，這種 message 存在 session 裡面
// set session and flash
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
// set passport
app.use(passport.initialize())
app.use(passport.session())
// set method-override
app.use(methodOverride('_method'))
// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})
// /upload 這組路由，這裡因為是靜態檔案，所以不需要像其他的路由一樣寫 controller 邏輯，直接用 express.static 來指定路徑就可以了
app.use('/upload', express.static(__dirname + '/upload'))

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// 把 passport 傳入 routes
require('./routes')(app, passport)

module.exports = app
