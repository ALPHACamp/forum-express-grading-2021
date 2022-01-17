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
const Followship = db.Followship
const helpers = require('../_helpers')

const userController = {

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

  getUser: (req, res, callback) => {
    if (req.user.id !== Number(req.params.id)) {
      return res.redirect('back')
    }
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    })
      .then(user => {
        // console.log(user.Comments.length)
        return callback({ user: user.toJSON() })
      })
  },

  editUser: (req, res, callback) => {
    if (req.user.id !== Number(req.params.id)) {
      return res.redirect('back')
    }
    return User.findByPk(req.params.id, { raw: true })
      .then(user => {
        return callback({ user: user })
      })
  },

  putUser: (req, res, callback, next) => {

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
              callback({ status: 'success', message: '使用者資料編輯成功' })
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
              callback({ status: 'success', message: '使用者資料編輯成功' })
            })
            .catch(next)
        })
    }
  },

  addFavorite: (req, res, callback, next) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        callback({ status: 'success', message: '' })
      })
      .catch(next)
  },

  removeFavorite: (req, res, callback, next) => {
    return Favorite.destroy({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      callback({ status: 'success', message: '' })
    })
      .catch(next)
  },

  addLike: (req, res, callback, next) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        callback({ status: 'success', message: '' })
      })
      .catch(next)
  },

  removeLike: (req, res, callback, next) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((restaurant) => {
        callback({ status: 'success', message: '' })
      })
      .catch(next)
  },

  getTopUser: (req, res, callback, next) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return callback({ users: users })
    })
      .catch(next)
  },

  addFollowing: (req, res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        callback({ status: 'success', message: '' })
      })
  },

  removeFollowing: (req, res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}


module.exports = userController