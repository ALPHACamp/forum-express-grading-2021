const express = require('express')
const handlebars  = require('express-handlebars')
const db = require('./models')
const methodOverride = require('method-override')
const flash = require('connect-flash')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const session = require('express-session')
const passport = require('./config/passport')

const app = express()
const port = process.env.PORT || 3000

const hbs = handlebars.create({ /* config */ })
app.engine('handlebars', hbs.engine)
// app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(express.urlencoded({extended: true}))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(__dirname + '/upload'))


app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  next()
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})

require('./routes')(app, passport)

module.exports = app



