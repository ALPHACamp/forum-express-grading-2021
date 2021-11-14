const express = require('express');
const handlebars  = require('express-handlebars');
const db = require('./models') // 引入資料庫
const app = express()
const port = 3000
app.use(express.urlencoded({extended: true}))

const hbs = handlebars.create({ /* config */ });
app.engine('handlebars', hbs.engine);
// app.engine('handlebars', handlebars({ defaultLayout: 'main' }))

app.set('view engine', 'handlebars');

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

require('./routes')(app)

module.exports = app



