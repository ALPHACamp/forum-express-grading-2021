const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')

app.engine('hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
require('./routes')(app)

module.exports = app
