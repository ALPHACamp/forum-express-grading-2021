const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '1eb7ec1e0dfcf6d'
const bcrypt = require('bcryptjs')
const helpers = require('../_helpers')
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    if(req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    }
    User.findOne({where: {email: req.body.email}}).then(user => {
      if(user) {
        req.flash('error_messages', '信箱重複！')
        return res.redirect('/signup')
      }
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
      }).then(user => {
        return res.redirect('/signin')
      })
    })
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

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: Comment
    }).then(user => {
      if (!user.Comments) { //如果User沒有Comment,則直接render
        return res.render('profile', { user: user.toJSON() })
      }
      return Comment.findAll({
        raw: true,
        nest: true,
        where: {UserId: req.params.id},
        include: Restaurant,
        group: ['RestaurantId'] //'DISTINCT'也可去除重複資料，但無法使用複雜操作
        }).then(comments => {
          return res.render('profile', { comments, user: user.toJSON()})
      })
    })
    .catch(err => console.log(err))
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      //確認編輯身分是否一致
      if (Number(req.params.id) !== helpers.getUser(req).id) {
        req.flash('error_messages', "無法修改")
        return res.redirect('back')
      }
      return res.render('edit', { user: user.toJSON() })
    })
  },

  putUser: (req, res) => {
    //確認name有效
    if (!req.body.name) {
      req.flash('error_messages', "name or email didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user.update({
            name: req.body.name,
            email: req.body.email,
            image: file ? img.data.link : user.image
          })
            .then(user => {
              req.flash('success_messages', '使用者資料編輯成功')
              return res.redirect(`/users/${req.params.id}`)
            })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user.update({
          name: req.body.name,
          email: req.body.email,
          image: user.image
        })
          .then(user => {
            req.flash('success_messages', '使用者資料編輯成功')
            return res.redirect(`/users/${req.params.id}`)
          })
      })
    }
  }
}

module.exports = userController