const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant

//Setting Local Strategy
passport.use(new LocalStrategy({ 
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, (req, email, password, cb) => {
  User.findOne({ where: { email } }).then(user => {
    if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
    if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
    return cb(null, user)
  })
}))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      //撈出使用者收藏餐廳清單
      { model: Restaurant, as: 'FavoritedRestaurants' },
      { model: Restaurant, as: 'LikedRestaurants' }
    ]
  }).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport