const bcrypt = require('bcryptjs')
const db = require('../models')
const Comment = db.Comment
const User = db.User
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helper = require('../_helpers')

const userService = {
  signUp: async (req, res, cb) => {
    if (req.body.passwordCheck !== req.body.password) {
      return cb({ status: 'error', message: '兩次密碼輸入不相同！' })
    } else {
      try {
        const user = await User.findOne({ where: { email: req.body.email } })
        if (user) {
          req.flash('error_messages', '信箱重複！')
          return cb({ status: 'error', message: '信箱重複！' })
        }
      } catch (err) {
        console.log(err)
      }
    }
    try {
      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(
          req.body.password,
          bcrypt.genSaltSync(10),
          null
        )
      })
      return cb({ status: 'success', message: '成功註冊帳號！' })
    } catch (err) {
      console.log(err)
    }
  },

  getUser: async (req, res, cb) => {
    if (helper.getUser(req).id !== Number(req.params.id)) {
      return cb({ status: 'error', message: '禁止偷看別人資料！' })
    }
    try {
      const userProfile = (
        await User.findByPk(req.params.id, {
          include: [
            { model: Restaurant, as: 'FavoritedRestaurants' },
            { model: Comment, include: Restaurant },
            { model: User, as: 'Followers' },
            { model: User, as: 'Followings' }
          ]
        })
      ).toJSON()
      let commentedRestaurants = userProfile.Comments
      let commentRestaurantId = userProfile.Comments.map(i => i.RestaurantId)
      //刪掉重複評論餐廳
      for (let i = 0; i < commentRestaurantId.length; i++) {
        for (let a = i + 1; a < commentRestaurantId.length; a++) {
          if (commentRestaurantId[i] === commentRestaurantId[a]) {
            commentRestaurantId.splice(i, 1)
            commentedRestaurants.splice(i, 1)
            i--
            a--
          }
        }
      }
      return cb({
        status: 'success',
        message: '',
        userProfile,
        commentedRestaurants
      })
    } catch (err) {
      console.log(err)
    }
  },
  putUser: async (req, res, cb) => {
    try {
      if (helper.getUser(req).id !== Number(req.params.id)) {
        return cb({ status: 'error', message: '禁止修改他人個資！' })
      }
      const user = await User.findByPk(req.params.id)
      if (!req.body.name || !req.body.email) {
        return cb({ status: 'error', message: '名字不能空白！' })
      }

      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await user.update({
            ...req.body,
            image: file ? img.data.link : helper.getUser(req).image
          })
          return cb({ status: 'success', message: '使用者資料編輯成功' })
        })
      } else {
        await user.update({ name: req.body.name, email: req.body.email })
        return cb({ status: 'success', message: '使用者資料編輯成功' })
      }
    } catch (err) {
      console.log(err)
    }
  },
  addFavorite: async (req, res, cb) => {
    try {
      await Favorite.create({
        UserId: helper.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return cb({ status: 'success', message: 'add to favorite successfully.' })
    } catch (err) {
      console.log(err)
    }
  },
  removeFavorite: async (req, res, cb) => {
    try {
      await Favorite.destroy({
        where: {
          UserId: req.user.id,
          RestaurantId: req.params.restaurantId
        }
      })
      return cb({ status: 'success', message: 'remove favorite successfully' })
    } catch (err) {
      console.log(err)
    }
  },
  addLike: async (req, res, cb) => {
    try {
      await Like.create({
        UserId: helper.getUser(req).id,
        RestaurantId: req.params.restaurantId
      })
      return cb({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  removeLike: async (req, res, cb) => {
    try {
      await Like.destroy({
        where: {
          UserId: helper.getUser(req).id,
          RestaurantId: req.params.restaurantId
        }
      })
      return cb({ status: 'success', message: 'remove successfully' })
    } catch (err) {
      console.log(err)
    }
  },
  getTopUser: async (req, res, cb) => {
    try {
      let users = await User.findAll({
        include: [{ model: User, as: 'Followers' }]
      })
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: helper
          .getUser(req)
          .Followings.map(d => d.id)
          .includes(user.id)
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return cb({ users: users, status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  addFollowing: async (req, res, cb) => {
    try {
      await Followship.create({
        followerId: helper.getUser(req).id,
        followingId: req.params.userId
      })
      return cb({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  removeFollowing: async (req, res, cb) => {
    try {
      await Followship.destroy({
        where: {
          followerId: helper.getUser(req).id,
          followingId: req.params.userId
        }
      })
      return cb({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userService
