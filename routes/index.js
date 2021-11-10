const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')


module.exports = (app, passport) => {

  // 如果使用者訪問首頁，就導向 /restaurants的頁面
  app.get('/', (req, res) => res.redirect('/restaurants'))
  // 在 /restaurants 底下則交給 restController.getRestaurants來處理
  app.get('/restaurants', restController.getRestaurants)

  // 遇到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', adminController.getRestaurants)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.sugnUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: 'signin', failureFlash: true }), userController.signIn)
  
  app.get('/logout', userController.logout)
}
