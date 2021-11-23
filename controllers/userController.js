const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const helpers = require('../_helpers')

// 去除評論中重複的餐廳
const removeDBLComment = (rawData) => {
  const comments = []
  for (let data of rawData) {
    // 如果在comments中有存在相同的RestaurantId就回傳true
    const check = comments.find(comment => comment.RestaurantId === data.RestaurantId)
    if (!check) {
      comments.push(data)
    }
  }
  return comments
}

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

  getUser: async (req, res) => {
     try {
      const user = (await User.findByPk(req.params.id,
        { include: { model: Comment, include: { model: Restaurant, attribute: ['id', 'image'] } } }
      )).toJSON()

      // user.isUser = req.user.id === Number(req.params.id)
      user.isUser = helpers.getUser(req).id === Number(req.params.id)

      // 因應測試檔若user.Comments不存在，執行removeDBLComment會報錯，因此新增判斷式
      user.Comments ? user.Comments = removeDBLComment(user.Comments) : ''
      user.Comments ? user.commentCount = user.Comments.length : ''
      
      return res.render('profile', { user })
    } catch (err) {
      console.error(err)
    }
  },

  editUser: (req, res) => {
    if (helpers.getUser(req).id !== Number(req.params.id)) return res.redirect('back')
    return User.findByPk(req.params.id, {raw:true}).then(user => {
      return res.render('edit', { user } )
  })},

  putUser: async (req, res) => {
    try {
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
  }

}


module.exports = userController