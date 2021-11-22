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
  },
  postRestaurant: async (req, res) => {
    adminService.postRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  editRestaurant: async (req, res) => {
    adminService.editRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  putRestaurant: async (req, res) => {
    adminService.putRestaurant(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = adminController
