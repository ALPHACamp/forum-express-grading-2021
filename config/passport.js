const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')

const db = require('../models')
const User = db.User

// setup passport strategy
// passport.use(new LocalStrategy(option: 設定客製化選項, function 登入認證程序))
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    // 設置了 flash message，現在也想沿用，必須在 passport 的驗證邏輯裡，拿到 req 這個參數
    // 設定了 passReqToCallback: true，就可以 callback 的第一個參數裡拿到 req，這麼一來我們就可以呼叫 req.flash() 把想要客製化的訊息放進去
    passReqToCallback: true
  },
  (req, username, password, cb) => {
    User.findOne({where: { email: username }}).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON() // 此處與影片示範不同
    return cb(null, user)
  })
})

module.exports = passport