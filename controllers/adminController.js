const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const User = db.User

const adminController = {
  getRestaurants: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        raw: true,
        nest: true,
        include: [Category]
      })
      return res.render('admin/restaurants', { restaurants })
    } catch (err) {
      console.error(err)
    }
  },

  createRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      return res.render('admin/create', { categories })
    } catch (err) {
      console.error(err)
    }
  },

  postRestaurant: async (req, res) => {
    try {
      const { name, tel, address, opening_hours, description, categoryId } = req.body
      const { file } = req

      if (!name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      }

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          await Restaurant.create({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : null,
            CategoryId: categoryId
          })
        })
      } else {
        await Restaurant.create({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: null,
          CategoryId: categoryId
        })
      }

      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      console.error(err)
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category] })
      return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },

  editRestaurant: async (req, res) => {
    try {
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      const restaurant = await Restaurant.findByPk(req.params.id)
      return res.render('admin/create', { categories, restaurant: restaurant.toJSON() })
    } catch (err) {
      console.error(err)
    }
  },

  putRestaurant: async (req, res) => {
    try {
      const { name, tel, address, opening_hours, description, categoryId } = req.body
      const { file } = req

      if (!name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      }

      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID)
        imgur.upload(file.path, async (err, img) => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            name,
            tel,
            address,
            opening_hours,
            description,
            image: file ? img.data.link : restaurant.image,
            CategoryId: categoryId
          })
        })
      } else {
        const restaurant = await Restaurant.findByPk(req.params.id)
        await restaurant.update({
          name,
          tel,
          address,
          opening_hours,
          description,
          image: restaurant.image,
          CategoryId: categoryId
        })
      }

      req.flash('success_messages', 'restaurant was successfully to update')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      console.error(err)
    }
  },

  deleteRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id)
      await restaurant.destroy()
      req.flash('success_messages', 'restaurant was successfully deleted')
      return res.redirect('/admin/restaurants')
    } catch (err) {
      console.error(err)
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await User.findAll({ raw: true })
      return res.render('admin/users', { users })
    } catch (err) {
      console.error(err)
    } 
  },

  toggleAdmin: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id)

      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更管理者權限')
        return res.redirect('back')
      }

      await user.update({ isAdmin: !user.isAdmin })

      req.flash('success_messages', '使用者權限變更成功')
      return res.redirect('/admin/users')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = adminController
