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

    if (req.query.page) {
      offset = (req.query.page-1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    
    return Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset,
      limit: pageLimit
    }).then(result => {
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count/ pageLimit)
      const totalPage = Array.from({length: pages}).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1
      Category.findAll({raw: true, nest:true})
        .then(categories => {
          const data = result.rows.map(r => ({
            ...r.dataValues, description: r.dataValues.description.substring(0, 50),
            categoryName: r.Category.name
          }))
          return res.render('restaurants', {
            restaurants: data,
            categories, page: page,
            categoryId,
            totalPage: totalPage,
            prev: prev,
            next: next })
      })
    }) 
  },
  getRestaurant: (req, res) =>{
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: [User] }]
    }).then(restaurant => {
      return restaurant.increment('viewCounts')
    }).then(restaurant => {
      res.render('restaurant', { restaurant: restaurant.toJSON() })
    })
  },
  getFeeds: (req, res) =>{
    return Promise.all([
      Restaurant.findAll({
        limit: 10,
        raw: true,
        nest: true,
        order: [['createdAt', 'DESC']],
        include: [Category]
    }),
      Comment.findAll({
        limit:10,
        order: [['createdAt', 'DESC']],
        raw:true,
        nest: true,
        include: [Restaurant, User]
      })
    ]).then(([restaurants, comments]) =>{
      return res.render('feeds', { 
        restaurants,
        comments 
      })
    })
  },
  getDashBoard: async (req, res) => {
    const restaurantId = req.params.id
    const restaurant = await Restaurant.findByPk(restaurantId, {include:Category})
    const commentData = await Comment.findAndCountAll({where: { RestaurantId: restaurantId }})
    const commentCounts = commentData.count
    return res.render('dashboard', {
      restaurant: restaurant.toJSON(),
      commentCounts,
    })
  }
}

module.exports = restController