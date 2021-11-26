const bcrypt = require('bcryptjs')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

const db = require('../models')
const { User, Restaurant, Comment, Favorite, Like, Followship } = db

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }).then(user => {
      return res.redirect('/signin')
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
  getUser: async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      include: [
        Comment,
        { model: Comment, include: [Restaurant] }
      ]
    })
    return res.render('profile', { user: user.toJSON() })
  },
  // POST to create
  putUser: (req, res) => {
    if (req.params.id == helpers.getUser(req).id) {
      if (!req.body.name) {
        console.log(req.body)
        console.log(req.user.name)
        req.flash('error_messages', "name error")
        return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          return User.findByPk(req.params.id)
            .then(user => {
              return user.update({
                name: req.body.name,
                email: req.body.email ? req.body.email : getUser(req).email,
                image: file ? img.data.link : user.image
              })
            }).then((user) => {
              req.flash('success_messages', '使用者資料編輯成功')
              return res.redirect(`/users/${helpers.getUser(req).id}`)
            }).catch(err => console.log(err))
        })
      }
      else {
        return User.findByPk(req.params.id)
          .then(user =>
            user.update({
              name: req.body.name,
              email: req.body.email ? req.body.email : getUser(req).email,
              image: user.image
            }).then((user) => {
              req.flash('success_messages', '使用者資料編輯成功')
              return res.redirect(`/users/${helpers.getUser(req).id}`)
            })
          )
      }
    } else {
      req.flash('error_messages', '非使用者無編輯')
      return res.redirect('/admin/restaurants')
    }
  },
  editUser: async (req, res) => {
    if (req.params.id == helpers.getUser(req).id) {
      const user = await User.findByPk(req.params.id)
      res.render('edit', { user: user.toJSON() })
    } else {
      req.flash('error_messages', '非本人無法編輯')
      return res.redirect('back')
    }
  },
  addFavorite: (req, res) => {
    // console.log("============addFavorite=========")
    // console.log("req", req)
    // console.log("helpers.getUser(req)", helpers.getUser(req))
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    // console.log("============removeFavorite=========")
    // console.log("req", req)
    // console.log("helpers.getUser(req)", helpers.getUser(req))
    return Favorite.destroy({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(() => {
      return res.redirect('back')
    })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {

        return res.redirect('back')
      })
  },
  removeLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((like) => {
        return res.redirect('back')
      })
  },
  getTopUser: async (req, res) => {
    let users = await User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    })
    users = users.map(user => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length,
      isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
    }))
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
    return res.render('topUser', { users: users })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then((followship) => {
        return res.redirect('back')
      })
  },

  removeFollowing: (req, res) => {
    return Followship.destroy({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then((followship) => {
      return res.redirect('back')
    })
  }
}

module.exports = userController