const db = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User

const adminController = {
  // get all Users
  getUsers: (req, res) => {
    return User.findAll({raw: true}).then((users) => {
      return res.render('admin/users', { users: users })
    })
  },
  // toggle user isAdmin
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      if (user.email === 'root@example.com') {
        req.flash('error_messages', "禁止變更管理者權限")
        return res.redirect('back')
      } else {
        user.update({
          isAdmin: !user.isAdmin
        }).then((user) => {
          req.flash('success_messages', '使用者權限變更成功')
          res.redirect('/admin/users')
        })
      }
    })
  },
  // get all restaurants
  getRestaurants: (req, res) => {
    return Restaurant.findAll({ raw: true }).then(restaurants => {
      return res.render('admin/restaurants', { restaurants: restaurants })
    })
  },
  // get one restaurant
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then(restaurant => {
      return res.render('admin/restaurant', { restaurant: restaurant })
    })
  },
  // create page
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  // create new restaurant
  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "請填寫餐廳名稱")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null
        }).then((restaurant) => {
          req.flash('success_messages', '成功新增餐廳與圖片')
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
      })
        .then((restaurant) => {
          req.flash('success_messages', '成功新增餐廳')
          res.redirect('/admin/restaurants')
        })
    }
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, { raw: true }).then((restaurant) => {
      return res.render('admin/create', { restaurant: restaurant })
    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: file ? img.data.link : restaurant.image
          }).then((restaurant) => {
            req.flash('success_messages', '已成功更新餐廳資訊與圖片')
            res.redirect(`/admin/restaurants/${req.params.id}`)
          })
        })
      })
    } else {
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: null
          })
            .then((restaurant) => {
              req.flash('success_messages', '已成功更新餐廳資訊')
              res.redirect(`/admin/restaurants/${req.params.id}`)
            })
        })
    }
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            req.flash('success_messages', '成功刪除餐廳')
            res.redirect('/admin/restaurants')
          })
      })
  }
}

module.exports = adminController