const express = require('express');
const router = express.Router();
const passport = require('../config/passport')
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const helpers = require('../_helpers')
const restController = require('../controllers/restController.js')
const adminController = require('../controllers/adminController.js')
const userController = require('../controllers/userController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController')






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
router.get('/restaurants', authenticated, restController.getRestaurants)


// 連到 /admin 頁面就轉到 /admin/restaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))

// 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)

// render create restaurant route
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)

// post data to create restaurant
// app.post('/admin/restaurants', authenticatedAdmin, adminController.postRestaurant)
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
// get specific restaurant page
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)

// get specific restuarnt edit page
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)

// modify restaurant data
// app.put('/admin/restaurants/:id', authenticatedAdmin, adminController.putRestaurant)
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)


router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)

router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/logout', userController.logout)


router.get('/admin/users', authenticatedAdmin, adminController.getUsers)

router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin)

// categories related
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)

router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)

router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)

router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)


//如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, restController.getRestaurants)



router.get('/restaurants/feeds', authenticated, restController.getFeeds)

router.get('/restaurants/:id/dashboard', authenticated, restController.getDashBoard)

router.get('/restaurants/:id', authenticated, restController.getRestaurant)


// comment related
router.post('/comments', authenticated, commentController.postComment)

router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)



// user related
// topUser
router.get('/users/top', authenticated, userController.getTopUser)

router.get('/users/:id', authenticated, userController.getUser)

router.get('/users/:id/edit', authenticated, userController.editUser)

router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)

// following related
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)

router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)


module.exports = router