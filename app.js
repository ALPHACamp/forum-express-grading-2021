const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models')
const app = express()
const port = 3000

app.engine('hbs', exphbs({extname: '.hbs'}))
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)

module.exports = app
