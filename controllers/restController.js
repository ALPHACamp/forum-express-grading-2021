const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

const restController = {
  getRestaurants: async (req, res) => {
    try {
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
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      const categories = await Category.findAll({ raw: true, nest: true })
      return res.render('restaurants', {
        restaurants: data,
        categories: categories,
        categoryId: categoryId,
        page: page,
        totalPage: totalPage,
        prev: prev,
        next: next
      })
    } catch (err) {
      console.error(err)
    }
  },

  getRestaurant: async (req, res) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: User, as: 'FavoritedUsers' },
          { model: Comment, include: [User] }
        ]
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
      await restaurant.increment('viewCounts', { by: 1 })
      return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited })
    } catch (err) {
      console.error(err)
    }
  },

  getFeeds: async (req, res) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
        include: [Category],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      const comments = await Comment.findAll({
        limit: 10,
        include: [User, Restaurant],
        order: [['createdAt', 'DESC']],
        raw: true,
        nest: true
      })
      // const [restaurants, comments] = await Promise.all([restaurantsPromise, commentsPromise])
      return res.render('feeds', { restaurants, comments })
    } catch (err) {
      console.error(err)
    }
  },

  getDashBoard: async (req, res) => {
    try {
      const RestaurantId = req.params.id
      const restaurantPromise = Restaurant
        .findByPk(RestaurantId, { include: [Category] })
        .then(result => result.toJSON())
      const commentCountsPromise = Comment
        .findAndCountAll({ where: { RestaurantId } })
        .then(result => result.count)
      const [restaurant, commentCounts] = await Promise.all([restaurantPromise, commentCountsPromise])
      return res.render('dashboard', { restaurant, commentCounts })
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = restController
