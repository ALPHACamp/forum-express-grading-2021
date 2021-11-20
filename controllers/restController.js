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
          categoryName: r.Category.name
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
            {
              model: Comment, include: [User]
            }
          ],
          // raw: true,
          // nest: true
        }).then(restaurant => {
          // console.log('restaurant',restaurant)
          // console.log('**restaurant.toJSON()**',restaurant.toJSON())
          return res.render('restaurant', {
            restaurant: restaurant.toJSON()
            // restaurant: restaurant
          })
        })
    }
  }
module.exports = restController