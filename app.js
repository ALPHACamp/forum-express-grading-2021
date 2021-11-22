const db = require('./models')
const express = require('express')
const handlebars = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const passport = require('./config/passport')
const port = process.env.PORT || 3000
const session = require('express-session')
const app = express()



//Set handlebars as the view engine
app.engine('handlebars', handlebars({
  defaultLayout: 'main',
  helpers: require('./config/handlebars-helpers')
})) //{ defaultLayout: 'main' } could be ignored since it has become default in handlebars v3.1.0
app.set('view engine', 'handlebars')

app.use(express.urlencoded({ extended: true })) //body-parser
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use('/upload', express.static(__dirname + '/upload'))
app.use(methodOverride('_method'))

app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//1. Requires routes 2. Assigns "app" arg, so that the routes could use the object "app" to assign routes. 
require('./routes')(app, passport)

module.exports = app
