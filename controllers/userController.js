const bcrypt = require('bcryptjs')
const db = require('../models')
const user = require('../models/user')
const User = db.User
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const userController = {
    signUpPage: (req, res) => {
        return res.render('signup')
    },

    signUp: (req, res) => {
        // confirm password
        if (req.body.passwordCheck !== req.body.password) {
            req.flash('error_messages', '兩次密碼輸入不同！')
            return res.redirect('/signup')
        } else {
            // confirm unique user
            User.findOne({ where: { email: req.body.email } }).then(user => {
                if (user) {
                    req.flash('error_messages', '信箱重複！')
                    return res.redirect('/signup')
                } else {
                    User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
                    }).then(user => {
                        req.flash('success_messages', '成功註冊帳號！')
                        return res.redirect('/signin')
                    })
                }
            })
        }
    },
    signInPage: (req, res) => {
        return res.render('signin')
    },

    signIn: (req, res) => {
        req.flash('success_messages', '成功登入！')
        res.redirect('/restaurants')
    },

    logout: (req, res) => {
        req.flash('success_messages', '登出成功！')
        req.logout()
        res.redirect('/signin')
    },
    getUser: (req, res) => {
        return User.findByPk(req.params.id).then((user) => {
            return res.render('profile', {user: user.toJSON()})
        })
    },
    editUser: (req, res) => {
        return User.findByPk(req.params.id).then((user) => {
            return res.render('profileedit', { user: user.toJSON() })
        })
    },
    putUser: (req, res) => {
        const { name, email } = req.body
        const { file, user: loginUser } = req

        if (loginUser.id !== Number(req.params.id)) {
            req.flash("error_messages", "無法更改其他使用者的資料")
            return res.redirect("back")
        }
        
        if (!name || !email || !file) {
            req.flash("error_messages", "使用者資料沒有變更")
            return res.redirect("back")
        }
        if(file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                return User.findByPk(req.params.id)
                    .then((user) => {
                        user.update({
                            name,
                            email,
                            image: file ? img.data.link : user.image
                        }).then((user) => {
                            req.flash('success_messages', '編輯成功')
                            res.redirect(`/users/${req.params.id}`)
                        })
                    })
            })
        } else {
            return User.findByPk(req.params.id)
                .then((user) => {
                    user.update({
                        name,
                        email,
                        image: user.image
                    })
                        .then((user) => {
                            req.flash('success_messages', '編輯成功')
                            res.redirect(`/users/${req.params.id}`)
                        })
                })
        }
    }
}

module.exports = userController