const bcrypt = require("bcryptjs")
const db = require("../models")
const User = db.User

const userController = {
  // Render sign up page
  signUpPage: (req, res) => {
    return res.render("signup")
  },

  // Handle user sign ups
  signUp: (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }).then((user) => {
      return res.redirect("/signin")
    })
  }
}

module.exports = userController
