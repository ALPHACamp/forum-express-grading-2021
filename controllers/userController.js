const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
  //負責 render 註冊的頁面
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  //負責實際處理註冊的行為
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({
        where: {
          email: req.body.email
        }
      }).then(user => {
        if (user) {
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
  //signIn 動作裡看起來沒有任何的邏輯，就直接轉址了，
  //這是因為等下我們會用 Passport 的 middleware 來處理，所以不必自己實作
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },
  //logout 動作也只需要使用 Passport 提供的 req.logout() 就可以了。
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },
  //userController.getUser
  getUser: (req, res) => {
    //找到現在正在使用中的使用者，其在資料庫中的資料，並且選渲染其個人頁面
    return User.findByPk(req.params.id)
      .then((user) => {
        return res.render('profile', {
          user: user
        })
      })
  },
  //userController.editUser
  editUser: (req, res) => {
    return User.findByPk(req.params.id)
      .then((user) => {
        return res.render('edit', {
          user: user
        })
      })
  },
  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    //更新姓名、email、圖片
    const {
      file
    } = req

    if (file) {
      //這行再複習
      imgur.setClientID(IMGUR_CLIENT_ID)
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

    } else {
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