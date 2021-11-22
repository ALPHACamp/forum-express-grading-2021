const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category
const adminService = require('../Services/adminService')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
        req.flash('error_messages', "name didn't exist")
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
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('admin/create', { restaurant, categories })
    } catch (err) {
      console.log(err)
    }
  },

  putRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    try {
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: req.body.categoryId
          })
          req.flash('success_messages', 'restaurant was successfully to update')
          res.redirect('/admin/restaurants')
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: restaurant.image,
          CategoryId: req.body.categoryId
        })
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      }
    } catch (err) {
      console.log(err)
    }
  },
  deleteRestaurant: async (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (err) {
      console.log(err)
    }
  },
  toggleAdmin: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更管理者權限')
        return res.redirect('back')
      }
      user.isAdmin === false ? (user.isAdmin = true) : (user.isAdmin = false)
      await user.update({ isAdmin: user.isAdmin })
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = adminController
