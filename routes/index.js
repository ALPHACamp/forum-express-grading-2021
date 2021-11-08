const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')

module.exports = (app) => {
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurant)

  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurants)
}
