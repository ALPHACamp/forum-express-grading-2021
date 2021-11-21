const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({
      raw: true,
      nest: true,
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    })
    .then(restaurants => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(restaurants.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      const data = restaurants.rows.map((r) => ({
        ...r,description: r.description.substring(0, 50),
        categoryName: r.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({
        raw: true 
      })
      .then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
        include: [
          Category,
          { model: Comment, include: [User]},
          { model: User, as: 'FavoritedUsers' },
          { model: User, as: 'LikedUsers' },
        ],
      }).then(restaurant => {
        const viewCounts = restaurant.viewCounts + 1
        restaurant.update({
          viewCounts: viewCounts
        })
        .then(restaurant => {
          const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
          const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
          return res.render('restaurant', {
            restaurant: restaurant.toJSON(),
            isFavorited: isFavorited,
            isLiked: isLiked
          })
        })
      })
  },
  getFeeds: (req, res) => {   //Promise.all
    return Promise.all([
      Restaurant.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [Category]
      }),
      Comment.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [['createdAt', 'DESC']],
          include: [User, Restaurant]
      })
    ])
    .then(([restaurants, comments]) => {
      return res.render('feeds', {
          restaurants: restaurants,
          comments: comments
      })
    })
  },
  getDashBoard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    })
    .then(restaurant => {
      // console.log(restaurant)
      return res.render('dashboard', { 
        restaurant: restaurant.toJSON() 
      })
    })
  }  
}
module.exports = restController