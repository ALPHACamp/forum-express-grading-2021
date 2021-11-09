const db = require('../models')
const Restaurant = db.Restaurant
const fs = require('fs')

const adminController = {
  getRestaurants: async (req, res) => {
    const restaurants = await Restaurant.findAll({ raw: true })
    return res.render('admin/restaurants', { restaurants })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, async (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, async () => {
          await Restaurant.create({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : null,
          })
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      await Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
      })
      req.flash('success_messages', 'restaurant was successfully created')
      return res.redirect('/admin/restaurants')
    }
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
    return res.render('admin/restaurant', { restaurant: restaurant })
  },
  editRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { raw: true })
    return res.render('admin/create', { restaurant })
  },

  putRestaurant: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      fs.readFile(file.path, async (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, async () => {
          const restaurant = await Restaurant.findByPk(req.params.id)
          await restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? `/upload/${file.originalname}` : restaurant.image,
          })
          req.flash('success_messages', 'restaurant was successfully to update')
          res.redirect('/admin/restaurants')
        })
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
      })
      req.flash('success_messages', 'restaurant was successfully to update')
      res.redirect('/admin/restaurants')
    }
  },
  deleteRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.destroy()
    return res.redirect('/admin/restaurants')
  },
}

module.exports = adminController
