const restService = require('../Services/restService')

const restController = {
  getRestaurants: async (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.render('restaurants', data)
    })
  },
  getRestaurant: async (req, res) => {
    restService.getRestaurant(req, res, data => {
      return res.render('restaurant', data)
    })
  },
  getFeeds: async (req, res) => {
    restService.getFeeds(req, res, data => {
      return res.render('feeds', data)
    })
  },
  getDashBoard: async (req, res) => {
    restService.getDashBoard(req, res, data => {
      res.render('dashboard', data)
    })
  },
  getTopRestaurant: async (req, res) => {
    restService.getTopRestaurant(req, res, data => {
      return res.render('topRestaurant', data)
    })
  }
}
module.exports = restController
