const Category = db.Category
const adminService = require('../Services/adminService')

const adminController = {
  getRestaurants: async (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render('admin/restaurants', data)
    })
  },
  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { categories })
    } catch (err) {
      console.log(err)
    }
  },

  postRestaurant: async (req, res) => {
    adminService.postRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: async (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.render('admin/restaurant', data)
    })
  },
  editRestaurant: async (req, res) => {
    adminService.editRestaurant(req, res, data => {
      return res.render('admin/create', data)
    })
  },

  putRestaurant: async (req, res) => {
    adminService.putRestaurant(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      req.flash('success_messages', data.message)
      return res.redirect(`/admin/restaurants/${req.params.id}`)
    })
  },
  deleteRestaurant: async (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: async (req, res) => {
    adminService.getUsers(req, res, data => {
      return res.render('admin/users', data)
    })
  },
  toggleAdmin: async (req, res) => {
    adminService.toggleAdmin(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', '禁止變更管理者權限')
        return res.redirect('back')
      }
      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    })
  }
}
module.exports = adminController
