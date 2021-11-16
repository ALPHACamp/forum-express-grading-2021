const fs = require('fs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ 
      raw: true,
      nest: true,
      include: [Category]
    }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurants: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "Name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then(restaurant => {
        req.flash('success_messages', "restaurant was successfully created")
        res.redirect('/admin/restaurants')
      })
    }
  },


  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { 
      include: [Category]
    }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/create', { restaurant })
    })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "Name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then(restaurant => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image
            })
          }).then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully created')
            return res.redirect('/admin/restaurants')
          })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then(restaurant => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
          })
            .then(restaurant => {
              req.flash('success_messages', "restaurant was successfully updated")
              res.redirect('/admin/restaurants')
            })
        })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true }).then(users => {
      return res.render('admin/users', { users })
    })
  },


  
  toggleAdmin: async (req, res) => {
    let user = await User.findByPk(req.params.id)
      if (user.email === 'root@example.com') {
        req.flash('error_messages', '禁止變更管理者權限')
        return res.redirect('back')
      }
      user = await user.update({isAdmin: !user.isAdmin})
      req.flash('success_messages', '使用者權限變更成功')
      res.redirect('/admin/users')
  }
}

module.exports = adminController