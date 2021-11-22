const adminController = require('../controllers/adminController.js')
const restController = require('../controllers/restController.js')
const userController = require('../controllers/userController.js')
module.exports = (app, passport) => {
  app.get('/', (req, res) => { res.redirect('/restaurants') })
  app.get('/restaurants', restController.getRestaurant)

  app.get('/admin', (req, res) => res.redirect('/admon/restaurants'))
  app.get('/admin/restaurants', adminController.getRestaurant)

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}
