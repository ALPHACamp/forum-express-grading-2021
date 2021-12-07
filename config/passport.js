const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

// setup passport strategy
passport.use(new LocalStrategy(
  // customize user field 我想要認證的東西
  {
    usernameField: 'email',
    passwordField: 'password',
    //設置了 flash message，現在也想沿用，那麼就必須在 passport 的驗證邏輯裡，拿到 req 這個參數。
    //如果在第一組參數裡設定了 passReqToCallback: true，就可以 callback 的第一個參數裡拿到 req，
    //這麼一來我們就可以呼叫 req.flash() 把想要客製化的訊息放進去。
    passReqToCallback: true
  },
  // authenticate user
  (req, username, password, cb) => {
    User.findOne({
      where: {
        email: username
      }
    }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
//這邊的功用是減少 session 的空間
// 序列化」這個技術的用意就是只存 user id，不存整個 user，而「反序列化」就是透過 user id，把整個 user 物件實例拿出來。
//當資料很大包、會頻繁使用資料，但用到的欄位又很少時，就會考慮使用序列化的技巧來節省空間
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport