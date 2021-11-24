const { CommandCompleteMessage } = require('pg-protocol/dist/messages')
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
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

    const result = await Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
    // data for pagination
    const page = Number(req.query.page) || 1
    const pages = Math.ceil(result.count / pageLimit)
    const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
    const prev = page - 1 < 1 ? 1 : page - 1
    const next = page + 1 > pages ? pages : page + 1
    // clean up restaurant data
    const data = result.rows.map(r => ({
      ...r.dataValues,
      description: r.dataValues.description.substring(0, 50),
      categoryName: r.Category.name
    }))
    //categories
    const categories = await Category.findAll({ raw: true, nest: true })
    //render
    return res.render('restaurants', {
      restaurants: data,
      categories,
      categoryId,
      page,
      totalPage,
      prev,
      next
    })
  },
  getRestaurant: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id,
      {
        include: [
          Category,
          { model: Comment, include: [User] }
        ]
      })
    await restaurant.update({ ...restaurant.dataValues, viewcount: restaurant.viewcount + 1 })
    return res.render('restaurant', { restaurant: restaurant.toJSON() })
  },
  getFeeds: async (req, res) => {
    const restaurantsPromise = Restaurant.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [Category]
    })
    const commentsPromise = Comment.findAll({
      limit: 10,
      raw: true,
      nest: true,
      order: [['createdAt', 'DESC']],
      include: [User, Restaurant]
    })
    const [restaurants, comments] = await Promise.all([restaurantsPromise, commentsPromise])
    return res.render('feeds', { restaurants, comments })
  },
  getDashBoard: async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, { include: [Category, Comment] })
    return res.render('dashboard', { restaurant: restaurant.toJSON() })
  }

}

module.exports = restController
