const restController = require('../controllers/restController.js')
module.exports = app => {

  //如果使用者訪問首頁，就導向 /restaurants.hbs 的頁面
  app.get('/', (req, res) => res.redirect('/restaurants'))

  //在 /restaurants 底下則交給 restController.getRestaurants 這個function來處理
  app.get('/restaurants', restController.getRestaurants)
}