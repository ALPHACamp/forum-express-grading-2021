// 載入所需套件
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")
const db = require('../models')
const User = db.User
const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '此信箱已註冊過！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
                req.flash('success_messages', '您已經成功註冊帳號！')
                return res.redirect('/signin')
              })
          }
        })
    }
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '您已經成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '您已經成功登出！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: async (req, res) => {
    try {
      const user = (await User.findByPk(req.params.id)).toJSON()
      return res.render('profile', { user })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  editUser: async (req, res) => {
    try {
      // 登入的使用者id和req.params.若不相同(代表是修改id進入)，重新導回profile頁面，確保只有自己能修改自己的資料
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        req.flash('error_messages', "無法變更他人Profile")
        res.redirect(`/users/${helpers.getUser(req).id}`)
      }
      const user = (await User.findByPk(req.params.id)).toJSON()
      return res.render('edit', { user })
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },

  putUser: async (req, res) => {
    try {
      // 確保name和email皆有輸入
      if (!req.body.name || !req.body.email) {
        req.flash('error_messages', "name或email尚未輸入")
        res.redirect('back')
      }

      // 確認email在資料庫沒有重複(利用[Op.not]排除修改者本身的email，以排除未修改的狀況)
      const emailCheck = await User.findOne({ where: { email: req.body.email, [Op.not]: { id: req.params.id } } })
      if (emailCheck) {
        req.flash('error_messages', "此email已註冊過")
        res.redirect('back')
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const user = await User.findByPk(req.params.id)
          await user.update({
            ...req.body,
            image: file ? img.data.link : helpers.getUser(req).image
          })
          req.flash('success_messages', '使用者資料編輯成功')
          res.redirect(`/users/${user.id}`)
        })
      } else {
        const user = await User.findByPk(req.params.id)
        await user.update({
          ...req.body,
          image: helpers.getUser(req).image
        })
        req.flash('success_messages', '使用者資料編輯成功')
        res.redirect(`/users/${user.id}`)
      }
    } catch (err) {
      return res.render('errorPage', { layout: false, error: err.message })
    }
  },
}

// userController export
module.exports = userController