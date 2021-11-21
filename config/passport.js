const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    // console.log(req, username, cb)
    // console.log(email, password)
    User.findOne({ where: { email: username } })
        .then(user => {
            if (!user) 
                return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
            if (!bcrypt.compareSync(password, user.password)) 
                return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
            return cb(null, user)
        })
    }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      //以id as UserId來固定 Restaurant table的 UserId, 所以可以找出所有*id* Favorite 的 restaurants
      { model: Restaurant, as: 'FavoritedRestaurants' },
      //以id as UserId來固定 Restaurant table的 UserId, 所以可以找出所有*id* Likes 的 restaurants
      { model: Restaurant, as: 'LikedRestaurants' },
      //以id as followingId 來固定 User table 的 followingId, 所以可以找出所有在追蹤*id*的users
      { model: User, as: 'Followers' }, 
      //以id as followingId 來固定 User table 的 followerId, 所以可以找出*id*在追蹤的所有users
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    // console.log(user.toJSON())
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport