const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurant: async (req, res) => {
    let restaurants = await Restaurant.findAll({ include: Category })
    const data = restaurants.map((r) => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
    }))
    return res.render('restaurants', { restaurants: data })
  },
}
module.exports = restController
