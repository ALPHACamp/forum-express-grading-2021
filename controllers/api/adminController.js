const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminService = require('../../Services/adminService')

const adminController = {
  getRestaurants: async (req, res) => {
    adminService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },
  getRestaurant: async (req, res) => {
    adminService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  deleteRestaurant: async (req, res) => {
    adminService.deleteRestaurant(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController
