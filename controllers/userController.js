const db = require('../models')
const User = db.User
const helper = require('../_helpers')
const userService = require('../Services/userService')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: async (req, res) => {
    userService.signUp(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('/signup')
      }
      req.flash('success_messages', '成功註冊帳號！')
      return res.redirect('/signin')
    })
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
    userService.getUser(req, res, data => {
      if (data.status === 'error') {
        return res.redirect('back')
      }
      return res.render('profile', data)
    })
  },
  editUser: async (req, res) => {
    if (helper.getUser(req).id !== Number(req.params.id)) {
      req.flash('error_messages', '禁止修改他人個資！')
      return res.redirect(`/users/${helper.getUser(req).id}`)
    }
    try {
      const user = await User.findByPk(req.params.id)
      return res.render('edit', { user: user.toJSON() })
    } catch (err) {
      console.log(err)
    }
  },

  putUser: async (req, res) => {
    userService.putUser(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', '使用者資料編輯成功')
      return res.redirect(`/users/${helper.getUser(req).id}`)
    })
  },
  addFavorite: async (req, res) => {
    userService.addFavorite(req, res, data => {
      return res.redirect('back')
    })
  },
  removeFavorite: async (req, res) => {
    userService.removeFavorite(req, res, data => {
      return res.redirect('back')
    })
  },
  addLike: async (req, res) => {
    userService.addLike(req, res, data => {
      return res.redirect('back')
    })
  },
  removeLike: async (req, res) => {
    userService.removeLike(req, res, data => {
      return res.redirect('back')
    })
  },
  getTopUser: async (req, res) => {
    userService.getTopUser(req, res, data => {
      return res.render('topUser', data)
    })
  },
  addFollowing: async (req, res) => {
    userService.addFollowing(req, res, data => {
      return res.redirect('back')
    })
  },
  removeFollowing: async (req, res) => {
    userService.removeFollowing(req, res, data => {
      return res.redirect('back')
    })
  }
}

module.exports = userController
