const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: async (req, res) => {
    let restaurants = await Restaurant.findAll({ include: Category })
    const data = restaurants.map((r) => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
    }))
    return res.render('restaurants', { restaurants: data })
  },
  getRestaurant: async (req, res) => {
    let restaurant = await Restaurant.findByPk(req.params.id, {
      include: Category,
    })
    return res.render('restaurant', { restaurant: restaurant.toJSON() })
  },
}
module.exports = restController
