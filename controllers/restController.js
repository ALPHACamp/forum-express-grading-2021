const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10

const restController = {
  getRestaurants: async (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    let result = await Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit,
    })
    const page = Number(req.query.page)
    const pages = Math.ceil(result.count / pageLimit)
    const totalPage = Array.from({ length: pages }).map(
      (item, index) => index + 1
    )
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1
    const data = result.rows.map((r) => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
    }))
    let categories = await Category.findAll({
      raw: true,
      nest: true,
    })
    return res.render('restaurants', {
      restaurants: data,
      categories,
      categoryId,
      page,
      totalPage,
      prev,
      next,
    })
  },
  getRestaurant: async (req, res) => {
    let restaurant = await Restaurant.findByPk(req.params.id, {
      include: Category,
    })
    return res.render('restaurant', { restaurant: restaurant.toJSON() })
  },
}
module.exports = restController
