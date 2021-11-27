const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

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
  }
}
  
module.exports = userController