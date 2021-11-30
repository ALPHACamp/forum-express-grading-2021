const helpers = require('../_helpers')


const restController = require('../controllers/restController.js')
//從controllers中引入admincontroller，和後在下方設定admin的路由
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')

const multer = require('multer')
const upload = multer({
  dest: 'temp/'
})

module.exports = (app, passport) => {

  const authenticated = (req, res, next) => {
    //檢查使用者是否有登入，沒有登入的話就把他導回登入頁
    //改用 ensureAuthenticated
    if (helpers.ensureAuthenticated(req)) {
      return next()
    }
    res.redirect('/signin')
  }
  //檢查是不是管理員身分，是的話就導到後台，不是的話導回首頁
  const authenticatedAdmin = (req, res, next) => {
    // if(req.isAuthenticated)
    if (helpers.ensureAuthenticated(req)) {
      if (helpers.getUser(req).isAdmin) {
        return next()
      }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  //如果使用者訪問首頁，就導向 /restaurants.hbs 的頁面
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  //在 /restaurants 底下則交給 restController.getRestaurants 這個function來處理
  app.get('/restaurants', authenticated, restController.getRestaurants)

  // 連到 /admin 頁面就轉到 /admin/restaurants.hbs
  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  // 在 /admin/restaurants.hbs 底下則交給 adminController.getRestaurants 處理
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/signup', userController.signUpPage)
  //userController.signUp 負責的是把表單資料送進資料庫，
  app.post('/signup', userController.signUp)
  app.get('/signin', userController.signInPage)
  //當 userController.signIn 收到 request 時，就一定是登入後的使用者了，
  //這是為什麼剛才在 userController.signIn 沒看到驗證的邏輯。
  //從index.js這裡路由開始登入動作，成功之後才會導到 userController.signIn 產生成功訊息的flash message
  //因為在這裡已經驗證過了，所以在userController.signIn沒有再次驗證的必要
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  app.get('/logout', userController.logout)
  //新增一筆餐廳資料 
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  //透過動態路由找到該單個頁面，並且透過authenticatedAdmin驗證是否為管理員，而後使用editRestaurant function
  //來實現編輯的功能
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  //編輯單筆餐廳資料
  app.put('/admin/restaurants/:id', upload.single('image'), authenticatedAdmin, adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  app.get('/admin/users', authenticatedAdmin, adminController.getUsers)
  app.put('/admin/users/:id', authenticatedAdmin, adminController.putUsers)

  // user
  //get the sign up page
  app.get('/signup', userController.signUpPage)
  // use sign up function
  app.post('/signup', userController.signUp)
  //get the signin page
  app.get('/signin', userController.signInPage)
  // use the sign in function
  // 這行再搞清楚
  app.post('/signin', passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true
  }), userController.signIn)
  // logout function
  // casue logout didn't need to render page, so it only need call the function
  app.get('/logout', userController.logout)

}