const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

const userController = {
  //負責 render 註冊的頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  //負責實際處理註冊的行為
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', '成功註冊帳號！')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  //signIn 動作裡看起來沒有任何的邏輯，就直接轉址了，
  //這是因為等下我們會用 Passport 的 middleware 來處理，所以不必自己實作
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  //logout 動作也只需要使用 Passport 提供的 req.logout() 就可以了。
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }


}

module.exports = userController