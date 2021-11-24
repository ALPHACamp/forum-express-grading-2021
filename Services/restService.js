const db = require('../models')
const Restaurant = db.Restaurant
const Comment = db.Comment
const User = db.User
const Category = db.Category
const pageLimit = 10
const helper = require('../_helpers')

const restService = {
  getRestaurants: async (req, res, cb) => {
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
    try {
      const result = await Restaurant.findAndCountAll({
        include: Category,
        where: whereQuery,
        offset,
        limit: pageLimit
      })
      const page = Number(req.query.page)
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      )
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        isFavorited: helper
          .getUser(req)
          .FavoritedRestaurants.map(d => d.id)
          .includes(r.id),
        isLiked: helper
          .getUser(req)
          .LikedRestaurants.map(d => d.id)
          .includes(r.id)
      }))
      const categories = await Category.findAll({
        raw: true,
        nest: true
      })
      return cb({
        status: 'success',
        message: '',
        restaurants: data,
        categories,
        categoryId,
        page,
        totalPage,
        prev,
        next
      })
    } catch (err) {
      console.log(err)
    }
  },
  getRestaurant: async (req, res, cb) => {
    try {
      const restaurant = await Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User] },
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' }
        ]
      })
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(
        helper.getUser(req).id
      )
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(
        helper.getUser(req).id
      )
      const viewCounts = restaurant.viewCounts + 1
      await restaurant.update({ viewCounts })
      return cb({
        status: 'success',
        message: '',
        restaurant: restaurant.toJSON(),
        isFavorited,
        isLiked
      })
    } catch (err) {
      console.log(err)
    }
  },
  getFeeds: async (req, res, cb) => {
    try {
      const restaurants = await Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
      })
      const comments = await Comment.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      })
      return cb({ status: 'success', message: '', restaurants, comments })
    } catch (err) {
      console.log(err)
    }
  },
  getDashBoard: async (req, res, cb) => {
    try {
      const restaurant = (
        await Restaurant.findByPk(req.params.id, {
          include: [Comment, Category]
        })
      ).toJSON()
      cb({ status: 'success', message: '', restaurant })
    } catch (err) {
      console.log(err)
    }
  },
  getTopRestaurant: async (req, res, cb) => {
    try {
      let restaurants = await Restaurant.findAll({
        include: [{ model: User, as: 'FavoritedUsers' }]
      })
      restaurants = restaurants.map(restaurant => ({
        ...restaurant.dataValues,
        favoritedCount: restaurant.FavoritedUsers.length,
        description: restaurant.description,
        isFavorited: helper
          .getUser(req)
          .FavoritedRestaurants.filter(
            favorite => favorite.id === restaurant.id
          )
      }))
      restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount)
      return cb({ status: 'success', message: '', restaurants })
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = restService
