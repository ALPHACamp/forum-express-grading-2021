
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js') // 加入這行
const userController = require('../controllers/userController.js')
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController')

module.exports = (app) => {
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


  //在 /restaurants 底下則交給 restController.getRestaurants 來處理
  app.get('/restaurants', authenticated, restController.getRestaurants)


  // 連到 /admin 頁面就轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

  // 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  // render create restaurant route
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)

  // post data to create restaurant
  // app.post('/admin/restaurants', authenticatedAdmin, adminController.postRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  // get specific restaurant page
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  // get specific restuarnt edit page
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

  // modify restaurant data
  // app.put('/admin/restaurants/:id', authenticatedAdmin, adminController.putRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
  app.get('/logout', userController.logout)


  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)

  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  // categories related
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)

  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


  //如果使用者訪問首頁，就導向 /restaurants 的頁面
  app.get('/', authenticated, restController.getRestaurants)

  app.get('/restaurants/feeds', authenticated, restController.getFeeds)

  app.get('/restaurants/:id/dashboard', authenticated, restController.getDashBoard)

  app.get('/restaurants/:id', authenticated, restController.getRestaurant)


  // comment related
  app.post('/comments', authenticated, commentController.postComment)

  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)



  // user related
  app.get('/users/:id', authenticated, userController.getUser)

  app.get('/users/:id/edit', authenticated, userController.editUser)

  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)




}
