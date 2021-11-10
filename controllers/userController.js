const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    // 檢查password !== passwordCheck
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '密碼與檢查密碼不一致！')
      res.redirect('/signup')
    }　else {
      // 檢查是否重複註冊email
      return User.findOne({where:{email: req.body.email}})
        .then( (user) => {
          if (user) {
            req.flash('error_messages', '這個Email已經註冊過！')
            res.redirect('/signup')
          } else {
            req.flash('success_messages', '註冊成功!')
            return User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => { res.redirect('/signin') })
          }
        })
    }  
  }
}

module.exports = userController
