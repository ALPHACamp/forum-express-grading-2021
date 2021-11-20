const bcrypt = require('bcryptjs') 
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'f669e34454e3859'
const User = db.User
const fs = require('fs')
const Restaurant = db.Restaurant
const Comment = db.Comment

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
      include: [
        { model: Comment, include: [Restaurant] }
      ]
    })
    .then(user => {
      // console.log(user.toJSON())
      // console.log('****************length*******',user.toJSON().Comments.length)
      return res.render('profile', {
        user: user.toJSON()
      })
    })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id, {
      raw: true
    })
    .then((user) => {
      return res.render('edit', { user: user })
    })
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req // equal to const file = req.file
    // console.log('****req.body****', req.body)
    // console.log('****file****', file)
    if (file) {
      
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              email: req.body.email,
              image: file ? img.data.link : user.image
            })
            .then((user) => {
              req.flash('success_messages', '使用者資料編輯成功')
              res.redirect(`/users/${req.params.id}`)
            })
          })
      })
    }
    else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name,
            email: req.body.email,
            image: user.image
          })
          .then((user) => {
            req.flash('success_messages', '使用者資料編輯成功')
            res.redirect(`/users/${req.params.id}`)
          })
      })
    }
  }
}

module.exports = userController