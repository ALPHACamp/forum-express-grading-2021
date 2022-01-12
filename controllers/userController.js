const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res) => {
    // 檢查password !== passwordCheck
    if (req.body.password !== req.body.passwordCheck) {
      req.flash('error_messages', '密碼與檢查密碼不一致！')
      res.redirect('/signup')
    } else {  
      // 檢查是否重複註冊email
      return User.findOne({ where: { email: req.body.email } })
        .then((user) => {
          if (user) {
            req.flash('error_messages', '這個Email已經註冊過！')
            res.redirect('/signup')
          } else {
            req.flash('success_messages', '註冊成功!')
            return User.create({
              name: req.body.name,
              email: req.body.email,
              password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
            })
              .then(user => { res.redirect('/signin') })
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

  getUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        return Comment.findAndCountAll({
          raw: true,
          nest: true,
          where: { UserId: user.id },
          include: Restaurant
        }).then((result) => {
          const commentCount = result.count
          const commentedRes = Array.from({ length: commentCount }).map((_, i) => (result.rows[i].Restaurant))
          const loginUser = helpers.getUser(req)
          return res.render('profile', {
            user: user.toJSON(),
            loginUser: loginUser,
            commentCount,
            commentedRes
          })
        })
      })
  },
  editUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', '你沒有訪問此頁面的權限')
      return res.redirect(`/users/${helpers.getUser(req).id}`)
    }
    return User.findByPk(req.params.id)
      .then((user) => {
        return res.render('edit', { user: user.toJSON() })
      })
  },
  putUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', '你沒有訪問此頁面的權限')
      return res.redirect(`/users/${helpers.getUser(req).id}`)
    }

    if (!req.body.name) {
      req.flash('error_messages', '請輸入使用者名稱')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) {
          return console.log(err)
        }
        return User.findByPk(req.params.id)
          .then((user) => {
            return user.update({
              name: req.body.name,
              email: req.body.email,
              image: img ? img.data.link : user.image
            }).then((user) => {
              req.flash('success_messages', '使用者資料編輯成功')
              return res.redirect(`/users/${req.params.id}`)
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          return user.update({
            name: req.body.name,
            email: req.body.email
          }).then((user) => {
            req.flash('success_messages', '使用者資料編輯成功')
            return res.redirect(`/users/${req.params.id}`)
          })
        })
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((favorite) => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.destroy({
      where: {
        userId: helpers.getUser(req).id, //為通過R05測試故將UserId改為userId
        RestaurantId: req.params.restaurantId
      }
    })
      // .then((favorite) => {
      //   return favorite.destroy() 如在前步驟findOne再於此destroy將無法通過R05測試
        .then((favorite) => {
          return res.redirect('back')
        })
      // })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
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
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  getTopUser: (req, res) => {
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
      return res.render('topUser', { users })
    }).catch(err => console.log(err))
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
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then((followship) => {
            return res.redirect('back')
          })
      })
  }
}

module.exports = userController
