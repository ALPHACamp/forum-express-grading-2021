const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User

const userController = {
  // Render sign in page
  signInPage: (req, res) => {
    if (req.user) return res.redirect('/restaurants')
    return res.render("signin")
  },

  // User login successful
  signIn: (req, res) => {
    return res.redirect("/restaurants")
  },

  logout: (req, res) => {
    req.logout()
    req.flash("success_messages", "Logout Successful!")
    return res.redirect("/signin")
  },

  // Render sign up page
  signUpPage: (req, res) => {
    return res.render("signup")
  },

  // Handle user sign ups
  signUp: (req, res) => {
    // confirm password
    if (req.body.password !== req.body.passwordCheck) {
      req.flash("error_messages", "Password Inconsistent!")
      return res.redirect("/signup")
    }

    // check unique user
    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        req.flash("error_messages", "This email has been registered.")
        return res.redirect("/signup")
      }
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
      }).then((user) => {
        req.flash("success_messages", "Signup Successfully!")
        return res.redirect("/signin")
      })
    })

    // New user signup
  }
}

module.exports = userController
