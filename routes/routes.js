const express = require('express')
const router = express.Router()
const passport = require('passport')
const userController = require('../controllers/userController')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')
const helper = require('../_helpers')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })

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

router.get('/', (req, res) => res.redirect('/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurant)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get(
  '/restaurants/:id/dashboard',
  authenticated,
  restController.getDashBoard
)
router.post(
  '/favorite/:restaurantId',
  authenticated,
  userController.addFavorite
)
router.delete(
  '/favorite/:restaurantId',
  authenticated,
  userController.removeFavorite
)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)

router.get(
  '/signin',

  userController.signInPage
)
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }),
  userController.signIn
)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)
router.post('/comments', authenticated, commentController.postComment)
router.delete(
  '/comments/:id',
  adminAuthenticated,
  commentController.deleteComment
)

router.get('/admin', (req, res) => res.redirect('/admin/restaurants'))
router.get(
  '/admin/restaurants',
  adminAuthenticated,
  adminController.getRestaurants
)
router.get(
  '/admin/restaurants/create',
  adminAuthenticated,
  adminController.createRestaurant
)
router.post(
  '/admin/restaurants',
  adminAuthenticated,
  upload.single('image'),
  adminController.postRestaurant
)
router.get(
  '/admin/restaurants/:id',
  adminAuthenticated,
  adminController.getRestaurant
)
router.delete(
  '/admin/restaurants/:id',
  adminAuthenticated,
  adminController.deleteRestaurant
)
router.get(
  '/admin/restaurants/:id/edit',
  adminAuthenticated,
  adminController.editRestaurant
)
router.put(
  '/admin/restaurants/:id',
  adminAuthenticated,
  upload.single('image'),
  adminController.putRestaurant
)
router.get('/admin/users', adminController.getUsers)
router.put('/admin/users/:id/toggleAdmin', adminController.toggleAdmin)
router.get(
  '/admin/categories',
  adminAuthenticated,
  categoryController.getCategories
)
router.post(
  '/admin/categories',
  adminAuthenticated,
  categoryController.postCategory
)
router.get(
  '/admin/categories/:id',
  adminAuthenticated,
  categoryController.getCategories
)
router.put(
  '/admin/categories/:id',
  adminAuthenticated,
  categoryController.putCategory
)
router.delete(
  '/admin/categories/:id',
  adminAuthenticated,
  categoryController.deleteCategory
)
router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put(
  '/users/:id',

  upload.single('image'),
  userController.putUser
)

router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete(
  '/following/:userId',
  authenticated,
  userController.removeFollowing
)

module.exports = router
