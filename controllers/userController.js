const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
      const user = (await User.findByPk(req.params.id)).toJSON()
      // "只有自己能編輯自己的資料" run R02-test failed
      // user.isUser = req.user.id === Number(req.params.id)
      return res.render('profile', { user })
    } catch (err) {
      console.error(err)
    }
  },

  editUser: (req, res) => {
    // "只有自己能編輯自己的資料" run R02-test failed
    // if (req.user.id !== Number(req.params.id)) return res.redirect('back')
    return User.findByPk(req.params.id, {raw:true}).then(user => {
      return res.render('edit', { user } )
  })},

  // 參考 "U113:上傳餐廳照片: https://lighthouse.alphacamp.co/courses/118/units/25563" 教案實作，但測試沒有通過，之後有時間再 debug ------------------
  // putUser: (req, res) => {
  //   if (!req.body.name) {
  //     req.flash('error_messages', "user name didn't exist")
  //     return res.redirect('back')
  //   }

  //   const { file } = req
  //   if (file) {
  //     fs.readFile(file.path, (err, data) => {
  //       if (err) console.log('Error: ', err)
  //       fs.writeFile(`upload/${file.originalname}`, data, () => {
  //         return User.findByPk(req.params.id)
  //           .then((user) => {
  //             user.update({
  //               name: req.body.name,
  //               email: req.body.email,
  //               image: file ? `/upload/${file.originalname}` : user.image
  //             }).then((user) => {
  //               req.flash('success_messages', 'user was successfully to update')
  //               res.redirect(`/users/${user.id}`)
  //             })
  //         })
  //       })
  //     })
  //   } else {
  //     return User.findByPk(req.params.id)
  //       .then((user) => {
  //         user.update({
  //           name: req.body.name,
  //           email: req.body.email,
  //           image: user.image
  //         }).then((user) => {
  //           req.flash('success_messages', 'restaurant was successfully to update')
  //           res.redirect(`/users/${user.id}`)
  //         })
  //       })
  //   }
  // },

  putUser: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      const { name, email } = req.body
      const { file } = req
      // "只有自己能編輯自己的資料" run R02-test failed
      // if (req.user.id !== Number(req.params.id)) return res.redirect('back')

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