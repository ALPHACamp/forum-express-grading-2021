const userController = require('../controllers/userController')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const helper = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (helper.ensureAuthenticated(req)) {
      return next()
    }
    return res.redirect('/signin')
  }
  const adminAuthenticated = (req, res, next) => {
    if (helper.ensureAuthenticated(req)) {
      if (helper.getUser(req).isAdmin) {
        return next()
      }
      res.redirect('/restaurants')
    }
    res.redirect('/signin')
  }
  app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/restaurants', authenticated, restController.getRestaurant)
  app.get(
    '/signin',

    userController.signInPage
  )
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true,
    }),
    userController.signIn
  )
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/logout', userController.logout)

  app.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
  app.get(
    '/admin/restaurants',
    adminAuthenticated,
    adminController.getRestaurants
  )
  app.get(
    '/admin/restaurants/create',
    adminAuthenticated,
    adminController.createRestaurant
  )
  app.post(
    '/admin/restaurants',
    adminAuthenticated,
    upload.single('image'),
    adminController.postRestaurant
  )
  app.get(
    '/admin/restaurants/:id',
    adminAuthenticated,
    adminController.getRestaurant
  )
  app.delete(
    '/admin/restaurants/:id',
    adminAuthenticated,
    adminController.deleteRestaurant
  )
  app.get(
    '/admin/restaurants/:id/edit',
    adminAuthenticated,
    adminController.editRestaurant
  )
  app.put(
    '/admin/restaurants/:id',
    adminAuthenticated,
    upload.single('image'),
    adminController.putRestaurant
  )
  app.get('/admin/users', adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', adminController.toggleAdmin)
  app.get(
    '/admin/categories',
    adminAuthenticated,
    categoryController.getCategories
  )
  app.post(
    '/admin/categories',
    adminAuthenticated,
    categoryController.postCategory
  )
  app.get(
    '/admin/categories/:id',
    adminAuthenticated,
    categoryController.getCategories
  )
  app.put(
    '/admin/categories/:id',
    adminAuthenticated,
    categoryController.putCategory
  )
  app.delete(
    '/admin/categories/:id',
    adminAuthenticated,
    categoryController.deleteCategory
  )
}
