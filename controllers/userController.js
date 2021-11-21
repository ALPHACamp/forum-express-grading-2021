//設定上傳圖片功能
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const bcrypt = require('bcryptjs')
const db = require('../models')
const restaurant = require('../models/restaurant')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship
const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    //加入表單驗證
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同!')
      return res.redirect('/signup')
    } else {
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', '信箱重複!')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          })
            .then(user => {
              req.flash('success_messages', '成功註冊帳號!')
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

  //User profile
  getUser: (req, res) => {
    const userId = req.params.id
    return Comment.findAll({
      raw: true,
      nest: true,
      where: { userId: userId },
      include: [Restaurant]
    })
      .then(comments => {
        return User.findByPk(userId)
          .then(user => {
            res.render('profile', {
              user: user.toJSON(),
              comments
            })
          })
      })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        res.render('edit', {
          user: user.toJSON()
        })
      })
  },
  putUser: (req, res) => {
    if (!req.body.name || !req.body.email) {
      req.flash('error_messages', "name or email didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then(user => {
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
      return User.findByPk(req.params.id)
        .then(user => {
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
  },

  // 加入/移除最愛功能
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },
  removeFavorite: (req, res) => {
    return Favorite.destroy({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then(() => {
      return res.redirect('back')
    })
  },

  //加入 Like/unLike 功能
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    }).then(restaurant => {
      return res.redirect('back')
    })
  },
  removeLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  //新增美食達人功能
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        //計算追蹤者人數
        FollowerCount: user.Followers.length,
        //判斷登入使用者是否已追蹤該 user 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      //依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },

  //加入追蹤功能
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    }).then(followship => {
      return res.redirect('back')
    })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    }).then(followship => {
      followship.destroy()
        .then(followship => {
          return res.redirect('back')
        })
    })
  }
}

module.exports = userController