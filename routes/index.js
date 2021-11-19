const helpers = require('../_helpers')
const restController = require('../controllers/restController')
const adminController = require('../controllers/adminController')
const userController = require('../controllers/userController')
const categoryController = require('../controllers/categoryController')
const commentController = require('../controllers/commentController')

//加入 multer
const multer = require('multer')
const { authenticate } = require('passport')
const upload = multer({ dest: 'temp/' })

module.exports = (app, passport) => {
  //加入身分驗證
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

  //使用者如訪問首頁就會導向 / restaurants 頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))

  //設定前台瀏覽餐廳路由
  app.get('/restaurants', authenticated, restController.getRestaurants)

  //設定前台瀏覽個別餐廳路由
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  //設定評論餐廳路由
  app.post('/comments', authenticated, commentController.postComment)

  //設定管理員餐廳評論刪除路由
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  //設定使用者個人資料瀏覽、編輯路由
  app.get('/users/:id', authenticated, userController.getUser)
  app.get('/users/:id/edit', authenticated, userController.editUser)
  app.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

  //連到 /admin 頁面轉到 /admin/restaurants
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

  //在 /admin/restaurants 底下交給 adminControlles.getRestaurants 處理
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

  //設定新增餐廳表單路由
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

  //設定 show 餐廳路由
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

  //設定 edit 餐廳路由
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

  //設定刪除餐廳路由
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  //設定瀏覽 category 路由
  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)

  //設定新增 category 路由
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

  //設定編輯 category 路由
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

  //設定刪除 category 路由
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  //設定註冊路由
  app.get('/signup', userController.signUpPage)
  app.post('/signup', userController.signUp)

  //設定登入和登出路由
  app.get('/signin', userController.signInPage)
  app.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)

  //設定使用者權限路由
  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

  //設定登出路由
  app.get('/logout', userController.logout)
}
