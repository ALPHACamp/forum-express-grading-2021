const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js') // 加入這行
const userController = require('../controllers/userController.js')

module.exports = app => {
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)
  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
}