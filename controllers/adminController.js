const db = require('../models')
const Restaurant = db.Restaurant

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
    await Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description,
    })
    req.flash('success_messages', 'restaurant was successfully created')
    res.redirect('/admin/restaurants')
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
    const restaurant = await Restaurant.findByPk(req.params.id)
    Restaurant.findByPk(req.params.id)
    await restaurant.update({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description,
    })
    req.flash('success_messages', 'restaurant was successfully to update')
    res.redirect('/admin/restaurants')
  },
  deleteRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id)
    await restaurant.destroy()
    return res.redirect('/admin/restaurants')
  },
}

module.exports = adminController
