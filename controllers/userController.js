const bcrypt = require('bcryptjs')
const db = require("../models")
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body
    console.log('Got req.body: ', name, email, password, passwordCheck)
    // confirm password
    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次輸入密碼不同！')
      console.log('兩次輸入密碼不同！')
      return res.redirect('/signup') //OK
      // return res.render('signup', { name, email, password })  // flash訊息會在下次重新整理才出現；saveUninitialized: true/false都一樣

    } else {
      User.findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此帳號已註冊過')
            console.log('此帳號已註冊過')
            return res.redirect('/signup')
          } else {
            User.create({
              name, email,
              password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_message', '成功註冊帳號！')
                return res.redirect('/signin')
              })
          }
        })
    }
  }
}

module.exports = userController