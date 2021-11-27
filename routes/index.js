const restController = require('../controllers/restController.js')
//從controllers中引入admincontroller，和後在下方設定admin的路由
const adminController = require('../controllers/adminController.js')

module.exports = app => {

  //如果使用者訪問首頁，就導向 /restaurants.hbs 的頁面
  app.get('/', (req, res) => res.redirect('/restaurants'))
  //在 /restaurants 底下則交給 restController.getRestaurants 這個function來處理
  app.get('/restaurants', restController.getRestaurants)

  // 連到 /admin 頁面就轉到 /admin/restaurants.hbs
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  // 在 /admin/restaurants.hbs 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', adminController.getRestaurants)
}