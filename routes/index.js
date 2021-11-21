const adminController = require('../controllers/adminController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const restController = require('../controllers/restController.js')
const userController = require('../controllers/userController.js')
const passport = require('passport')
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
      if (helpers.getUser(req).isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant) //create a restaurant
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant) //render detail page
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant) // edit a restaurant
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers) // render users page
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin) //change users' authority

  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

  app.get('/logout', userController.logout)

  //render categories page/ add category
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  //render category edit page/ edit category
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  //delete category
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //comments
  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  //favorite
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

  //like
  app.post('/like/:restaurantId', authenticated, userController.addLike)
  app.delete('/like/:restaurantId', authenticated, userController.removeLike)
}
