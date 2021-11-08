const express = require('express')
const handlebars = require('express-handlebars')
const db = require('./models')
const app = express()
const port = 3000

// template engine
app.engine('handlebars', handlebars())
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app  //app測試環境用
