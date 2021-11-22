const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

const restController = {
  getRestaurants: async (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }

    const restaurants = await Restaurant.findAll({ include: Category, where: whereQuery })
    const data = restaurants.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      categoryName: r.Category.name
    }))
    const categories = await Category.findAll({ raw: true, nest: true })
    return res.render('restaurants', { restaurants: data, categories, categoryId })
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { include: Category })
    return res.render('restaurant', { restaurant: restaurant.toJSON() })
  },
}

module.exports = restController
