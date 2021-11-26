const db = require('../models')
const Restaurant = db.Restaurant
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
// const { userInfo } = require('os')
const IMGUR_CLIENT_ID = '0f45c06002b9fdc'
const Category = db.Category
const helpers = require('../_helpers')
const adminService = require('../services/adminService')



const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/create', { categories: categories })
    })

  },

  postRestaurant: (req, res) => {

    adminService.postRestaurant(req, res, (data) => {

      if (data['status'] === "error") {
        req.flash('error_messages', data["message"])
        return res.redirect('back')
      }
      req.flash('success_messages', data["message"])
      res.redirect('/admin/restaurants')
    })
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, data => {
      res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    adminService.editRestaurant(req, res, (data) => {
      return res.render('admin/create', data)
    })
  },

  putRestaurant: (req, res) => {
    adminService.putRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      } else {
        req.flash('success_messages', 'restaurant was successfully to update')
        res.redirect('/admin/restaurants')
      }
    })



  },

  deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
    // return Restaurant.findByPk(req.params.id)
    //   .then((restaurant) => {
    //     restaurant.destroy()
    //       .then((restaurant) => {
    //         res.redirect('/admin/restaurants')
    //       })
    //   })
  },

  getUsers: (req, res) => {
    return User.findAll({ raw: true })
      .then(users => {
        return res.render('admin/users', { users })
      })
  },

  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id)
      .then(user => {

        const { isAdmin, email } = user.toJSON()

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