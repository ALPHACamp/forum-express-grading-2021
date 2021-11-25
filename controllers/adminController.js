const db = require('../models') 
const Restaurant = db.Restaurant
const Category = db.Category
const User = db.User
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = 'your_client_id'
const adminService = require('../services/adminService.js')

const adminController = {
    getRestaurants: (req, res ) => {
      adminService.getRestaurants(req, res, (data) => {
        res.render('admin/restaurants', data)
      })
    },
    getRestaurant: (req, res) => {
      adminService.getRestaurant(req, res, (data) => {
        res.render('admin/restaurant', data)
      })
    },
    createRestaurant: (req, res) => {
      Category.findAll({ 
        raw: true,
        nest: true
      }).then(categories => {
        return res.render('admin/create', {
          categories: categories
        })
      })
    },
    postRestaurant: (req, res) => {
      adminService.postRestaurant(req, res, (data) => {
        if (data['status'] === 'error'){
          req.flash('error_messages', data['message'])
        }
        req.flash('success_messages', data['message'])
        return res.redirect('/admin/restaurants')
      })
    },
    editRestaurant: (req, res) => {
      Category.findAll({
        raw: true,
        nest: true
      })
      .then(categories => {
        return Restaurant.findByPk(req.params.id, {
          raw: true,
        })
        .then(restaurant => {
          return res.render('admin/create', {
            categories: categories, 
            restaurant: restaurant
          })
        })
      })
    },
    putRestaurant: (req, res) => {
      adminService.putRestaurant(req, res, (data) => {
        if (data['status'] == 'error'){
          req.flash('error_messages', data['message'])
        }
        req.flash('success_messages', data['message'])
        return res.redirect('/admin/restaurants')
      })
    },
    deleteRestaurant: (req, res) => {
      adminService.deleteRestaurant(req, res, (data) => {
        if (data['status'] === 'success') {
          return res.redirect('/admin/restaurants')
        }
      })
    },
    getUsers: async (req, res) => {
        const users = await User.findAll({ raw: true })
        return res.render('admin/users', { users })
    },
    toggleAdmin: async (req, res) => {
        return User.findByPk(req.params.id)
        .then((user) => {
            if (user.email === 'root@example.com'){
                req.flash('error_messages', '禁止變更管理者權限')
                return res.redirect('back')
            }
            else{
                return user.update({ isAdmin: !user.isAdmin })
                .then(user => {
                    req.flash('success_messages', '使用者權限變更成功')
                    res.redirect('/admin/users')
                })
                .catch(error => console.log(error))
            }
        })
        .catch(error => console.log(error))
    }
}
module.exports = adminController