if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
//快閃訊息(flash message)」， 這種 message 存在 session 裡面， 通常只會出現一次， 在重新 request 之後就會消失了
const session = require('express-session')
const passport = require('./config/passport')
const app = express()
const port = process.env.PORT || 3000
const methodOverride = require('method-override')


//用 layouts / main 這個檔案做為預設的版型
app.engine('handlebars', handlebars({
  defaultLayout: 'main'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎
//都會先經過 app.use() 的處理，而我們把 bodyParser 指定成參數，就表示所有的請求都會先被 bodyParser 進行處理。
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 把 req.flash 放到 res.locals 裡面
// Express 幫我們開了一條捷徑，他給了一個 view 專用的 res.locals，只要把資料放進 res.locals，
// 就可以讓 View 也能存取到。
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  //把變數設放到 res.locals 裡，讓所有的 view 都能存取。因為 user 是一個很常用的變數，直接放到 res.locals 是比較好的選擇。
  res.locals.user = req.user
  next()
})
//就可以透過methodoverride的方法
app.use(methodOverride('_method'))
//打開 app.js 並加上 /upload 這組路由，這裡因為是靜態檔案，所以不需要像其他的路由一樣寫 controller 邏輯，直接用 express.static 來指定路徑就可以了：
app.use('/upload', express.static(__dirname + '/upload'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
//要注意 require('./routes')(app) 需要放在 app.js 的最後一行， 因為按照由上而下的順序， 
//當主程式把 app(也就是 express()) 傳入路由index.js時， 程式中間做的樣板引擎設定、 伺服器設定， 也要一併透過 app 變數傳進去。
//index.js中，透過module.exports匯出路由設定，接著到主程式 app.js 透過 require 引入該函式。
require('./routes')(app, passport)


//將app這個參數丟到index.js,app這個參數會再index.js運行，原本的app.get()，就會變成express().get(....)，因為在app.js中有引入express()
module.exports = app