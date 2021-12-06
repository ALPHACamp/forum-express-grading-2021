const restService = require('../../Services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.json(data)
    })
  },
  getRestaurant: async (req, res) => {
    restService.getRestaurant(req, res, data => {
      return res.json(data)
    })
  },
  getFeeds: async (req, res) => {
    restService.getFeeds(req, res, data => {
      return res.json(data)
    })
  },
  getDashBoard: async (req, res) => {
    restService.getDashBoard(req, res, data => {
      res.json(data)
    })
  },
  getTopRestaurant: async (req, res) => {
    restService.getTopRestaurant(req, res, data => {
      return res.json(data)
    })
  }
}

module.exports = restController
