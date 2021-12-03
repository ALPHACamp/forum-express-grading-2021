const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
//在這個例子裡，restController 是 controller 的名稱，
//而 getRestaurants 則是 controller 裡的一個 action。
//如果把程序抽取到 controller 裡，
//就需要在原本的路由去呼叫特定的 controller action。
const restController = {
  //getRestaurants 這個屬性的值是一個 function，而這個 function 負責「瀏覽餐廳頁面」
  //，也就是去 render 一個叫做 restaurants 的樣板
  getRestaurants: (req, res) => {
    const whereQuery = {}
    let categoryId = ''
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery.CategoryId = categoryId
    }
    Restaurant.findAll(({
      include: Category,
      where: whereQuery
    })).then(restaurants => {
      const data = restaurants.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
        categoryName: r.Category.name
      }))
      Category.findAll({
        raw: true,
        nest: true
      }).then(categories => { // 取出 categoies
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: Category
    }).then(restaurant => {
      return res.render('restaurant', {
        restaurant: restaurant.toJSON()
      })
    })
  }

}

module.exports = restController