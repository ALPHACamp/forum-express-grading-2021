
const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../controllers/api/adminController')
const categoryController = require('../controllers/api/categoryController')
const userController = require('../controllers/api/userController.js')
const passport = require('../config/passport')


const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
    console.log("進入 authenticatedAdmin")
    if (req.user) {
        if (req.user.isAdmin) { return next() }
        return res.json({ status: 'error', message: 'permission denied' })
    } else {
        return res.json({ status: 'error', message: 'permission denied' })
    }
}

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)

router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)

router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)


router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, authenticated, authenticatedAdmin, categoryController.deleteCategory)

router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)

router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)

router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)

router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)

// JWT signin
router.post('/signin', userController.signIn)

module.exports = router