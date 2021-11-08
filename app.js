const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const port = 3000

// 設定:樣板引擎
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
