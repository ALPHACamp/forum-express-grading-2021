const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'your_client_id'

const adminService = {
    getRestaurants: (req, res, callback) => {
      return Restaurant.findAll({ 
          raw: true, 
          nest: true, 
          include: [Category] 
      })
      .then(restaurants => {
        callback({restaurants: restaurants})
      })
    },
    getRestaurant: (req, res, callback) => {
        return Restaurant.findByPk(req.params.id, {
          raw: true, 
          nest: true,
          include: [Category]
        })
        .then(restaurant => {
          callback({restaurant:restaurant})
        })
    },
    deleteRestaurant: (req, res, callback) => {
        return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
            restaurant.destroy()
              .then((restaurant) => {
                callback({ status: 'success', message: '' })
            })
        })
    },
    postRestaurant: (req, res, callback) => {
        if (!req.body.name) {
            return callback({status: 'error', message: 'name does not exist'}) 
        //   req.flash('error_messages', "name didn't exist")
        //   return res.redirect('back')
        }
        const { file } = req // equal to const file = req.file
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
              return Restaurant.create({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                image: file ? img.data.link : null,
                CategoryId: req.body.categoryId
              }).then((restaurant) => {
                return callback({status: 'success', message: 'restaurant was successfully created'})
                // req.flash('success_messages', 'restaurant was successfully created')
                // return res.redirect('/admin/restaurants')
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
            image: null,
            CategoryId: req.body.categoryId
          }).then((restaurant) => {
            return callback({status: 'success', message: 'restaurant was successfully created'})
            // req.flash('success_messages', 'restaurant was successfully created')
            // return res.redirect('/admin/restaurants')
          })
        }
    },
    putRestaurant: (req, res, callback) => {
      // console.log(req.body)
      if (!req.body.name) {
        return callback({status: 'error', message: 'name does not exist'}) 
        // req.flash('error_messages', "name didn't exist")
        // return res.redirect('back')
      }
      const { file } = req
      if (file) {
        imgur.setClientID(IMGUR_CLIENT_ID);
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
              CategoryId: req.body.categoryId
            })
            .then((restaurant) => {
              return callback({status: 'success', message: 'restaurant was successfully created'})
              // req.flash('success_messages', 'restaurant was successfully to update')
              // res.redirect('/admin/restaurants')
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
            image: restaurant.image,
            CategoryId: req.body.categoryId
          }).then((restaurant) => {
            return callback({status: 'success', message: 'restaurant was successfully created'})
            // req.flash('success_messages', 'restaurant was successfully to update')
            // res.redirect('/admin/restaurants')
          })
        })
      }
    },
  }

  module.exports = adminService