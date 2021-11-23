const helpers = require('../_helpers')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const { name, email, password, passwordCheck } = req.body

    if (password !== passwordCheck) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      User
        .findOne({ where: { email } })
        .then(user => {
          if (user) {
            req.flash('error_messages', '信箱重複！')
            return res.redirect('/signup')
          } else {
            User
              .create({ name, email, password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null) })
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
    req.flash('success_messages', '成功登入！')
    return res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    return res.redirect('/signin')
  },

  getUser: async (req, res) => {
    try {
      const isYou = helpers.getUser(req).id === Number(req.params.id)
      const user = await User.findByPk(req.params.id, {
        include: { model: Comment, include: [Restaurant] }
      })
      return res.render('profile', { user: user.toJSON(), isYou })
    } catch (err) {
      console.error(err)
    }
  },

  editUser: async (req, res) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        req.flash('error_messages', '你無權查看此頁面')
        return res.redirect('/restaurants')
      }

      const user = await User.findByPk(req.params.id)
      return res.render('edit', { user: user.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },

  putUser: async (req, res) => {
    try {
      if (helpers.getUser(req).id !== Number(req.params.id)) {
        req.flash('error_messages', '你無權查看此頁面')
        return res.redirect('/restaurants')
      }

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
  },

  addFavorite: async (req, res) => {
    try {
      await Favorite.create({
        UserId: req.user.id,  // 不用 helpers.getUser(req)，因為 R05 有自定義 req
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  removeFavorite: async (req, res) => {
    try {
      await Favorite.destroy({
        where: {
          UserId: req.user.id,  // 不用 helpers.getUser(req)，因為 R05 有自定義 req
          RestaurantId: req.params.restaurantId
        }
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  addLike: async (req, res) => {
    try {
      await Like.create({
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  removeLike: async (req, res) => {
    try {
      await Like.destroy({
        where: {
          UserId: helpers.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      return res.redirect('back')
    } catch (err) {
      console.error(err)
    }
  },

  addFollowing: async (req, res) => {
    await Followship.create({
      followerId: helpers.getUser(req).id,
      followingId: req.params.userId
    })
    return res.redirect('back')
  },

  removeFollowing: async (req, res) => {
    await Followship.destroy({
      where: {
        followerId: helpers.getUser(req).id,
        followingId: req.params.userId
      }
    })
    return res.redirect('back')
  },

  getTopUser: async (req, res) => {
    let users = await User.findAll({ include: [{ model: User, as: 'Followers' }] })
    users = users.map(user => ({
      ...user.dataValues,
      FollowerCount: user.Followers.length,
      isFollowed: helpers.getUser(req).Followings.map(d => d.id).includes(user.id)
    }))
    users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
    return res.render('topUser', { users })
  }
}

module.exports = userController
