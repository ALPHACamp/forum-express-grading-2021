const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const port = 3000

//用 layouts / main 這個檔案做為預設的版型
app.engine('handlebars', handlebars({
  defaultLayout: 'main'
})) // Handlebars 註冊樣板引擎
app.set('view engine', 'handlebars') // 設定使用 Handlebars 做為樣板引擎

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
//要注意 require('./routes')(app) 需要放在 app.js 的最後一行， 因為按照由上而下的順序， 
//當主程式把 app(也就是 express()) 傳入路由index.js時， 程式中間做的樣板引擎設定、 伺服器設定， 也要一併透過 app 變數傳進去。
//index.js中，透過module.exports匯出路由設定，接著到主程式 app.js 透過 require 引入該函式。
require('./routes')(app)


//將app這個參數丟到index.js,app這個參數會再index.js運行，原本的app.get()，就會變成express().get(....)，因為在app.js中有引入express()
module.exports = app