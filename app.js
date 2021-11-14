const express = require('express')
const handlebars = require('express-handlebars') // 引入 handlebars
const db = require('./models')
const app = express()
const helpers = require('./_helpers')
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const methodOverride = require('method-override')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
app.use('/upload', express.static(__dirname + '/upload'))

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

// 把 req.flash 放到 res.locals 裡面
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = helpers.getUser(req)
  next()
})

app.use(methodOverride('_method'))
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app, passport)

module.exports = app
