const fs = require('fs')
const res = require('express/lib/response')
const db = require('../models')
const imgur = require('imgur-node-api')

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const Restaurant = db.Restaurant
const User = db.User
const Category = db.Category

// const SUPER_USER = process.env.SUPER_USER

const adminService = {
  getRestaurants: (req, res, callback) => {
    return Restaurant.findAll({
      raw: true,
      nest: true,
      include: [Category]
    })
      .then(restaurants => {
        callback({ restaurants: restaurants })
      })
  }
}

module.exports = adminService