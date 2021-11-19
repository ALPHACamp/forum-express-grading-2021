const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) {
      req.flash("error_messages", "兩次密碼輸入不同！")
      return res.redirect("/signup")
    } else {
      User
        .findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash("error_messages", "信箱重複！")
            return res.redirect("/signup")
          } else {
            User
              .create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })
              .then(user => {
                req.flash("success_messages", "成功註冊帳號！")
                return res.redirect("/signin")
              })
          }
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id,{
        include: { model: Comment, include: [Restaurant] }
      })
      console.log(user.toJSON().Comments)
      return res.render('profile', { user: user.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },

  editUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      return res.render('edit', { user: user.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },

  putUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      const { name, email } = req.body
      const { file } = req

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await user.update({
            name,
            email,
            image: file ? img.data.link : user.image
          })
        })
      } else {
        await user.update({
          name,
          email,
          image: user.image
        })
      }
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${user.id}`)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = userController
