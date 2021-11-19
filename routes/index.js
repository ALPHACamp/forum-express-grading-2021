const userController = require('../controllers/userController')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
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
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/feeds', authenticated, restController.getFeeds)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)
  app.get(
    '/restaurants/:id/dashboard',
    authenticated,
    restController.getDashBoard
  )
  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete(
    '/favorite/:restaurantId',
    authenticated,
    userController.removeFavorite
  )
  app.post('/like/:restaurantId', authenticated, userController.addLike)
  app.delete('/like/:restaurantId', authenticated, userController.removeLike)

  app.get(
    '/signin',

    userController.signInPage
  )
  app.post(
    '/signin',
    passport.authenticate('local', {
      failureRedirect: '/signin',
      failureFlash: true
    }),
    userController.signIn
  )
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)
  app.get('/logout', userController.logout)
  app.post('/comments', authenticated, commentController.postComment)
  app.delete(
    '/comments/:id',
    adminAuthenticated,
    commentController.deleteComment
  )

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
  app.get('/users/top', authenticated, userController.getTopUser)
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put(
    '/users/:id',

    upload.single('image'),
    userController.putUser
  )
}
