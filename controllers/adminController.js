const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '114844ca1961335'
const fs = require('fs')
const db = require('../models')
const {
  userInfo
} = require('os')
const Restaurant = db.Restaurant
//R01新增
const User = db.User

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({
      raw: true
    }).then(restaurants => {
      return res.render('admin/restaurants', {
        restaurants: restaurants
      })
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

    const {
      file
    } = req
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
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
    }
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true
    }).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      raw: true
    }).then(restaurant => {
      return res.render('admin/create', {
        //這裡的restaurant，前面這個是指view裡的restaurant，後面是指要傳入的restaurnat參數
        restaurant: restaurant
      })
    })
  },
  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    const {
      file
    } = req
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
              })
              .then((restaurant) => {
                req.flash('success_messages', 'restaurant was successfully to update')
                res.redirect('/admin/restaurants')
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
    return userInfo.findAll({
      rew: true
    }).then(users => {
      return res.render('admin/users', {
        urers: users
      })
    })
  },
  putUsers: (req, res) => {
    return userInfo.findByPk(req.params.id)
      .then((users) => {
        const isAdmin = !userInfo.isAdmin
        user.update({
            isAdmin
          })
          .then(() => {
            req.flash('success_messages', 'user updated successfully')
            res.redirect('/admin/users')
          })
      })
  },


  //下面這段流程再疏理一次
  //顯示使用者清單
  getUsers: (req, res) => {
    //convert entity to plain object, sequelize method
    return User.findAll({
      raw: true
    }).then((users) => {
      return res.render("admin/users", {
        users: users
      })
    })
  },
  //新增一個超級使用者，不可被更改，其它admin則可更改他者使用權限
  toggleAdmin: (req, res) => {
    return User.findByPk(req.params.id).then((user) => {
      //dataValues, sequelize methods
      //是超級使用者的情況
      const userData = user.dataValues
      if (userData.email === "root@example.com") {
        req.flash("error_messages", "禁止變更管理者權限")
        return res.redirect("back")
      }
      //不是超級使用者的情況，可以更改其它使用者的權限
      user.update({
        isAdmin: !userData.isAdmin
      }).then((user) => {
        req.flash("success_messages", "使用者權限變更成功")
        res.redirect("/admin/users")
      })
    })
  },


}

module.exports = adminController