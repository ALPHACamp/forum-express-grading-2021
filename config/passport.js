const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User

// Strategy config
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true
    },
    (req, email, password, done) => {
      // User Authentication
      User.findOne({ where: { email } }).then((user) => {
        // User not found
        if (!user)
          return done(
            null,
            false,
            req.flash("error_messages", "Email is not registered")
          )

        // Incorrect password
        if (!bcrypt.compareSync(password, user.password))
          return done(
            null,
            false,
            req.flash("error_messages", "Incorrect Password!")
          )

        // Pass Authentication
        return done(
          null,
          user,
          req.flash("success_messages", "Login Successfully!")
        )
      })
    }
  )
)

// Serialize & Deserialize
passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  User.findByPk(id).then((user) => {
    user = user.toJSON()
    return done(null, user)
  })
})

module.exports = passport
