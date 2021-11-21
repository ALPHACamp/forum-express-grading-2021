const sequelize = require('sequelize')
const helpers = require('../_helpers')
const db = require('../models')
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10

const restController = {
  getRestaurants: (req, res) => {
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
    Restaurant.findAndCountAll({ 
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    }).then(result  => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name,
        //檢查是不是有被使用者收藏
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
      include: [ //當項目變多時，需要改成用陣列
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      restaurant.increment('viewCounts')
      const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
      const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id) // 找出收藏此餐廳的 user
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
        isFavorited: isFavorited,
        isLiked: isLiked
      })
    })
  },

  getFeeds: (req, res) => {
    //兩個動作同時發生
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

  getDashBoard: (req, res) => {
    //其它方法: findAndCount()
    return Restaurant.findByPk(req.params.id, {
      raw: true,
      nest: true,
      include: [
        Category,
        { model: Comment, attributes: []}
      ],
      attributes: ['name', 'viewCounts',
        //新增欄位'計算評論總數'
        [sequelize.fn('COUNT', sequelize.col('comments.id')), 'totalComment']
      ]
    })
      .then(restaurant => {
        return res.render('dashboard', { restaurant })
      })
  },

  getTopRestaurant: (req, res) => {
    return Restaurant.findAll({
      include: [
        { model: User, as:'FavoritedUsers' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        //搭配line:126,取得多對多資料'FavoritedUsers'
        favoritedCount: r.FavoritedUsers.length,
        //搭配Passport傳入'使用者收藏餐廳.id'，在與'目標餐廳.id'進行比對
        isFavorited: helpers.getUser(req).FavoritedRestaurants.map(d => d.id).includes(r.id)
      }))
      restaurants = restaurants.sort((a, b) => b.FavoritedUsers.length - a.FavoritedUsers.length).slice(0, 10)
      return res.render('topRestaurant', { restaurants })
    })
  }
}

module.exports = restController