const bcrypt = require('bcryptjs')
const db = require('../../models')
const User = db.User

//JWT
const jwt = require('jsonwebtoken')
const passportJWT = require('passport-jwt')
const ExtractJwt = passportJWT.ExtractJwt
const JwyStrategy = passportJWT.Strategy

let userController = {
  signIn: async (req, res) => {
    try {
      // 檢查必要資料
      if (!req.body.email || !req.body.password) {
        return res.json({
          status: 'error',
          message: "required fields didn't exist"
        })
      }
      // 檢查 user 是否存在與密碼是否正確
      let username = req.body.email
      let password = req.body.password
      const user = await User.findOne({ where: { email: username } })
      if (!user) {
        return res
          .status(401)
          .json({ status: 'error', message: 'no such user found' })
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return res
          .status(401)
          .json({ status: 'error', message: 'passwords did not match' })
      }
      var payload = { id: user.id }
      var token = jwt.sign(payload, process.env.JWT_SECRET)
      return res.json({
        status: 'success',
        message: 'ok',
        token: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin
        }
      })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = userController
