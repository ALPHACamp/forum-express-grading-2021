const restController = require('../controller/restController')

module.exports = (app) => {
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', restController.getRestaurants)
}
