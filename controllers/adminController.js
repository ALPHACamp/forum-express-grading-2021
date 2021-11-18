const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const { userInfo } = require('os')
const IMGUR_CLIENT_ID = '0f45c06002b9fdc'
const Category = db.Category

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        console.log(restaurants)
        return res.render('admin/restaurants', { restaurants: restaurants })
      })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
      })
    }
    else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  getRestaurant: (req, res) => {
    Restaurant.findByPk(req.params.id, {
      include: [Category]
    })
      .then(restaurant => {
        console.log(restaurant.toJSON())
        res.render('admin/restaurant', { restaurant: restaurant.toJSON() })
      })
  },

  editRestaurant: (req, res) => {
    console.log(req.params.id)
    Restaurant.findByPk(req.params.id, { raw: true })
      .then(restaurant => {
        res.render('admin/create', { restaurant: restaurant })
      })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
            })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
              })
          })
      })
    }
    else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image
          })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully to update')
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
    return User.findAll({ raw: true, nest: true })
      .then(users => {
        return res.render('admin/users', { users: users })
      })
  },

  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {
        console.log(user.name)
        const { isAdmin, email } = user.toJSON()
        console.log(isAdmin)
        if (email === 'root@example.com') {
          req.flash('error_messages', '禁止變更管理者權限')
          return res.redirect('back')
        } else {
          user.update({
            isAdmin: !isAdmin
          })
            .then((user) => {
              req.flash('success_messages', '使用者權限變更成功')
              res.redirect('/admin/users')
            })

        }

      })
  }
}

module.exports = adminController