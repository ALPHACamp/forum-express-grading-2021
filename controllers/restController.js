const express = require('express')

const router = express.Router()


const restController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants')
  }
}
module.exports = restController