const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant
      .findAll({ raw: true })
      .then(restaurants => res.render('admin/restaurants', { restaurants }))
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err)

        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant
            .create({ name, tel, address, opening_hours, description, image: file ? `/upload/${file.originalname}` : null })
            .then(() => {
              req.flash('success_messages', 'restaurant was successfully created')
              return res.redirect('/admin/restaurants')
            })
        })
      })
    } else {
      return Restaurant
        .create({ name, tel, address, opening_hours, description, image: null })
        .then(() => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
    }
  },

  getRestaurant: (req, res) => {
    const id = req.params.id

    return Restaurant
      .findByPk(id, { raw: true })
      .then(restaurant => res.render('admin/restaurant', { restaurant }))
  },

  editRestaurant: (req, res) => {
    const id = req.params.id

    return Restaurant
      .findByPk(id, { raw: true })
      .then(restaurant => res.render('admin/create', { restaurant }))
  },

  putRestaurant: (req, res) => {
    const id = req.params.id
    const { name, tel, address, opening_hours, description } = req.body
    const { file } = req

    if (!name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err)

        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant
            .findByPk(id)
            .then(restaurant => restaurant.update({ name, tel, address, opening_hours, description, image: file ? `/upload/${file.originalname}` : restaurant.image }))
            .then(() => {
              req.flash('success_messages', 'restaurant was successfully to update')
              return res.redirect('/admin/restaurants')
            })
        })
      })
    } else {
      return Restaurant
        .findByPk(id)
        .then(restaurant => restaurant.update({ name, tel, address, opening_hours, description, image: restaurant.image }))
        .then(() => {
          req.flash('success_messages', 'restaurant was successfully to update')
          return res.redirect('/admin/restaurants')
        })
    }
  },

  deleteRestaurant: (req, res) => {
    const id = req.params.id

    return Restaurant
      .findByPk(id)
      .then(restaurant => restaurant.destroy())
      .then(() => {
        req.flash('success_messages', 'restaurant was successfully destroyed')
        return res.redirect('/admin/restaurants')
      })
  }
}

module.exports = adminController
