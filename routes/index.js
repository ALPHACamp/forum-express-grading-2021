const adminController = require('../controllers/adminController.js')
const restController = require('../controllers/restController.js')
const userController = require('../controllers/userController.js')
module.exports = (app) => {
  app.get('/', (req, res) => { res.redirect('/restaurants') })
  app.get('/restaurants', restController.getRestaurant)

  app.get('/admin', (req, res) => res.redirect('/admon/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurant)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
}
