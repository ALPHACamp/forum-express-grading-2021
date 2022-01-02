const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs') 
const db = require('../models')
const helper = require('../_helpers')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  
  signUp: (req, res) => {
    // confirm password
    if(req.body.passwordCheck !== req.body.password){
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({where: {email: req.body.email}}).then(user => {
        if(user){
          req.flash('error_messages', '信箱重複！')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
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
      res.redirect('/restaurants')
  },
     
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
    
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: { model: Comment, include: [Restaurant] }
    })
    .then(user => res.render('profile', { user: user.toJSON() }))
  },

  editUser: (req, res) => {
    return User.findByPk(req.params.id)
    .then(user => res.render('edit', { user: user.toJSON() }))
  },
  //使用 async/await 改寫失敗 (圖片無法上傳更新到資料庫內)
  // putUser: async (req, res) => {
  //   const userId = req.params.id
  //   const userData = await User.findByPk(userId)
  //   const { file } = req
  //   if (file) {
  //     imgur.setClientID(IMGUR_CLIENT_ID)
  //     await imgur.upload(file.path, (err, img) => {
  //       return userData.update({ image: img.data.link })
  //     })
  //   }
  //   await userData.update({
  //     name: req.body.name,
  //     email: req.body.email
  //   })
  //   await req.flash('success_messages','使用者資料編輯成功')
  //   return res.redirect(`/users/${userId}`)
  // }
  putUser: (req,res) => {
    return User.findByPk(req.params.id)
    .then(user =>{ 
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, (err, img) => {
          return user.update({
            name: req.body.name,
            email: req.body.email,
            image: file ? img.data.link : null
          })
          .then(()=>{
            req.flash('success_messages','使用者資料編輯成功')
            return res.redirect(`/users/${req.params.id}`)
          })
        })
      } else {
        return user.update({
          name: req.body.name,
          email: req.body.email
        })
        .then(()=>{
          req.flash('success_messages','使用者資料編輯成功')
          return res.redirect(`/users/${req.params.id}`)
        })
      }
    })
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: helper.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
      .then((restaurant) => {
        return res.redirect('back')
      })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: helper.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then((restaurant) => {
            return res.redirect('back')
          })
      })
  },
  addLike: (req, res) => {
    return Like.create({
      UserId: helper.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
    .then(() => res.redirect('back'))
  },
  removeLike: (req, res) => {
    return Like.destroy({
      where: {
        UserId: helper.getUser(req).id,
        RestaurantId: req.params.restaurantId  
      }
    })
    .then(() => res.redirect('back'))
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id)
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
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
    return Followship.findOne({where: {
      followerId: req.user.id,
      followingId: req.params.userId
    }})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.redirect('back')
         })
      })
   }
}
  
module.exports = userController