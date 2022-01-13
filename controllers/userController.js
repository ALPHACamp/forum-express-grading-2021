const fs = require('fs')
const bcrypt = require('bcryptjs')
const res = require('express/lib/response')
const db = require('../models')
const imgur = require('imgur-node-api')
const restaurant = require('../models/restaurant')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const helpers = require('../_helpers')

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
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => {
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

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入!')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功!')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    })
      .then(user => {
        // console.log(user.Comments.length)
        return res.render('profile', { user: user.toJSON() })
      })
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        return res.render('edit', { user: user })
      })
  },

  putUser: (req, res, next) => {

    const { file } = req

    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        if (err) {
          console.log(err)
        } else {
          return User.findByPk(req.params.id)
            .then((user) => {
              if (!user) {
                return Promise.reject(new Error('user 不存在'))
              }
              return user.update({
                name: req.body.name,
                email: req.body.email,
                image: file ? img.data.link : user.image
              })
            })
            .then(() => {
              req.flash('success_messages', '使用者資料編輯成功')
              res.redirect(`/users/${req.params.id}`)
            })
            .catch(next)
        }
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          if (!user) {
            return Promise.reject(new Error('user 不存在'))
          }
          return user.update({
            name: req.body.name,
            email: req.body.email,
            image: user.image
          })
            .then(() => {
              req.flash('success_messages', '使用者資料編輯成功')
              res.redirect(`/users/${req.params.id}`)
            })
            .catch(next)
        })
    }
  },

  addFavorite: (req, res, next) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
      .catch(next)
  },

  removeFavorite: (req, res, next) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
          .catch(next)
      })
  },

  addLike: (req, res, next) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
      .catch(next)
  },

  removeLike: (req, res, next) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
      .catch(next)
  }
}


module.exports = userController