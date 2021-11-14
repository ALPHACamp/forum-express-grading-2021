// const express = require('express')
// const handlebars = require('express-handlebars')
// const app = express()
// const port = 3000
//
// app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
// app.set('view engine', 'handlebars')
//
// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}!`)
// })
//
// require('./routes')(app)
//
// module.exports = app



const express = require('express');
const handlebars  = require('express-handlebars');
const app = express()
const port = 3000
const hbs = handlebars.create({ /* config */ });

// Register `hbs.engine` with the Express app.
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

require('./routes')(app)

module.exports = app
