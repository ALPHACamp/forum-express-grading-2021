const { CommandCompleteMessage } = require('pg-protocol/dist/messages')
const db = require('../models')
const { User, Restaurant, Comment, Favorite, Category } = db
const pageLimit = 10
const Sequelize = require('sequelize')
const helpers = require('../_helpers')

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
      categoryName: r.Category.name,
      isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
      isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
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
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' },
          { model: Comment, include: [User] }
        ]
      })
    await restaurant.update({ ...restaurant.dataValues, viewcount: restaurant.viewcount + 1 })
    const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
    const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
    return res.render('restaurant', { restaurant: restaurant.toJSON(), isFavorited, isLiked })
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
  },
  getTopRestaurant: async (req, res) => {
    let restaurants = await Restaurant.findAll({
      include: [{ model: User, as: 'FavoritedUsers' }],
      nest: true,
    })
    restaurants = restaurants.map(r => ({
      ...r.dataValues,
      favoritedCount: r.dataValues.FavoritedUsers.length,
      isFavorited: helpers
        .getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
    }))
    restaurants = restaurants.sort((a, b) => b.favoritedCount - a.favoritedCount).slice(0, 10)
    return res.render('topResurant', { restaurants })
  },
}

module.exports = restController
