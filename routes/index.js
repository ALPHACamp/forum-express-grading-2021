const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  const authenticatedAdmin = (req, res, next) => {
    if (helpers.ensureAuthenticated(req)) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)

  /* admin */
  // restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant) //create page
  app.post('/admin/restaurants', authenticatedAdmin,
    upload.single('image'), adminController.postRestaurant)                                  //create Restaurant (C)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)       //read Restaurant   (R)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant) //edit page
  app.put('/admin/restaurants/:id', authenticatedAdmin
    , upload.single('image'), adminController.putRestaurant)                                 //edit Restaurant   (U)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant) //delete Restaurant (D)
  // users
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)                     //read users   (R)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)  //edit users   (U)

  // categories
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)         //read categories  (R)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)         //edit categories  (U)
  /* user */
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)
}
