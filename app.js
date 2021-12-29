const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const db = require("./models")
const exphbs = require("express-handlebars")
const methodOverride = require("method-override")
const session = require("express-session")
const passport = require("./config/passport")
const flash = require("connect-flash")

// Set view engine to handlebars
app.engine("hbs", exphbs.engine({ extname: ".hbs" }))
app.set("view engine", "hbs")

// http and session setting
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true
  })
)

// Passport
app.use(passport.initialize())
app.use(passport.session())

// flash messages
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash("success_messages")
  res.locals.error_messages = req.flash("error_messages")
  res.locals.user = req.user
  next()
})

// Set static file path
app.use("/upload", express.static(__dirname + "/upload"))

// Override HTTP method
app.use(methodOverride("_method"))

require("./routes")(app, passport)

// Start server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app
