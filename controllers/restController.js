const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10
//在這個例子裡，restController 是 controller 的名稱，
//而 getRestaurants 則是 controller 裡的一個 action。
//如果把程序抽取到 controller 裡，
//就需要在原本的路由去呼叫特定的 controller action。
const restController = {
  //getRestaurants 這個屬性的值是一個 function，而這個 function 負責「瀏覽餐廳頁面」
  //，也就是去 render 一個叫做 restaurants 的樣板
  getRestaurants: (req, res) => {
    let offset = 0
    const whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.categoryId = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit
    }).then(result => {
      // data for pagination
      const page = Number(req.query.page) || 1
      const pages = Math.ceil(result.count / pageLimit)
      const totalPage = Array.from({
        length: pages
      }).map((item, index) => index + 1)
      const prev = page - 1 < 1 ? 1 : page - 1
      const next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.dataValues.Category.name
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
        {
          model: Comment,
          include: [User]
        }
      ]
    }).then(restaurant => {
      return res.render('restaurant', {
        restaurant: restaurant.toJSON(),
      })
    })
  },
  // getFeeds: (req, res) => {
  //   return Restaurant.findAll({
  //     limit: 10,
  //     raw: true,
  //     nest: true,
  //     order: [
  //       ['createdAt', 'DESC']
  //     ],
  //     include: [Category]
  //   }).then(restaurants => {
  //     Comment.findAll({
  //       limit: 10,
  //       raw: true,
  //       nest: true,
  //       order: [
  //         ['createdAt', 'DESC']
  //       ],
  //       include: [User, Restaurant]
  //     }).then(comments => {
  //       return res.render('feeds', {
  //         restaurants: restaurants,
  //         comments: comments
  //       })
  //     })
  //   })
  // },

  //Promise.all 接受的參數是一個陣列，
  //把 Restaurant.findAll() 和 Comment.findAll() 原封不動地放入陣列裡。Promise.all 會同時執行陣列中的程序。
  //等到 Restaurant.findAll() 和 Comment.findAll() 兩個都執行完以後，才會進入到最後的 then，把資料回傳給前端。

  getFeeds: (req, res) => {
    return Promise.all(
      [Restaurant.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [
            ['createdAt', 'DESC']
          ],
          include: [Category]
        }),
        Comment.findAll({
          limit: 10,
          raw: true,
          nest: true,
          order: [
            ['createdAt', 'DESC']
          ],
          include: [User, Restaurant]
        }).then(comments => {
          return res.render('feeds', {
            comments: comments,
            restaurants: restaurants
          })
        })
      ])
  }
}

module.exports = restController