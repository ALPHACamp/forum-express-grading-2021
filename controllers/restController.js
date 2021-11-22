const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    // 考慮沒有 page 參數的情況
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAndCountAll({ 
      include: Category,
      where: whereQuery ,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1  // 網址只有 /restaurants 的狀況
      // 總共有幾頁
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      // 上一頁與下一頁
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1 
      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name,
        isFavorited: req.user.FavoritedRestaurants.map(d => d.id).includes(r.id),
        isLiked: req.user.LikedRestaurants.map(d => d.id).includes(r.id)
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => {
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
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id) // 找出收藏此餐廳的 user
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      restaurant.increment('countViews')
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        // isFavorited: isFavorited,  // 將資料傳到前端
        isFavorited: isFavorited,
        isLiked: isLiked
      })
    })
  },

  getFeeds: (req, res) => {
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
    ]).then(([restaurants, comments]) => {
      return res.render('feeds', {
        restaurants: restaurants,
        comments: comments
      })
    })
  },

  getDashBoard: async (req, res) => {
    const whereQuery = {}
    whereQuery.RestaurantId = req.params.id

    return Promise.all([
      Comment.findAndCountAll({ include: [Restaurant], where: whereQuery }),
      Restaurant.findByPk(req.params.id, {
        include: [Category, { model: Comment, include: [User] }]
      })
    ]).then(([comments, restaurant]) => {
      const commentNumber = comments.count
      res.render('dashboard', { restaurant: restaurant.toJSON(), commentNumber })
    })
  }

}

module.exports = restController