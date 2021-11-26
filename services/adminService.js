const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const imgur = require('imgur-node-api')
// const { userInfo } = require('os')
const IMGUR_CLIENT_ID = '0f45c06002b9fdc'

const adminService = {
    getRestaurants: (req, res, callback) => {
        return Restaurant.findAll({ raw: true, nest: true, include: [Category] }).then(restaurants => {
            callback({ restaurants: restaurants })
        }).catch(error => {
            console.log(error)
        })
    },

    getRestaurant: (req, res, callback) => {
        return Restaurant.findByPk(req.params.id, {
            include: [Category]
        }).then(restaurant => {
            callback({ restaurant: restaurant.toJSON() })
        }).catch(error => {
            console.log(error)
        })
    },

    postRestaurant: (req, res, callback) => {
        if (!req.body.name) {
            return callback({ status: 'error', message: "name didn't exist" })
        }

        const { file } = req // equal to const file = req.file
        if (file) {
            imgur.setClientID(IMGUR_CLIENT_ID)
            imgur.upload(file.path, (err, img) => {
                return Restaurant.create({
                    name: req.body.name,
                    tel: req.body.tel,
                    address: req.body.address,
                    opening_hours: req.body.opening_hours,
                    description: req.body.description,
                    image: file ? img.data.link : null,
                    CategoryId: req.body.categoryId
                }).then((restaurant) => {
                    callback({ status: 'success', message: 'restaurant was successfully created' })
                }).catch(error => {
                    console.log(error)
                })
            })
        } else {
            return Restaurant.create({
                name: req.body.name,
                tel: req.body.tel,
                address: req.body.address,
                opening_hours: req.body.opening_hours,
                description: req.body.description,
                CategoryId: Number(req.body.categoryId)
            }).then((restaurant) => {
                callback({ status: 'success', message: 'restaurant was successfully created' })
            }).catch(error => {
                console.log(error)
            })
        }
    },

    deleteRestaurant: (req, res, callback) => {

        return Restaurant.findByPk(req.params.id)
            .then((restaurant) => {
                if (restaurant) {
                    restaurant.destroy()
                        .then((restaurant) => {
                            callback({ status: 'success', message: 'ok' })
                        })
                } else {
                    callback({ status: 'failure', message: 'fail' })
                }
            }).catch(error => {
                console.log(error)
            })
    },

    editRestaurant: (req, res, callback) => {
        Category.findAll({
            raw: true,
            nest: true
        })
            .then(categories => {
                return Restaurant.findByPk(req.params.id).then(restaurant => {
                    return callback({
                        categories: categories,
                        restaurant: restaurant.toJSON()
                    })
                })

            })
    },


    putRestaurant: (req, res, callback) => {
        if (!req.body.name) {
            return callback({ status: 'success', message: 'name didn\'t exist' })
        }

        const { file } = req
        if (file) {
            imgur.setClientID(process.env.IMGUR_CLIENT_ID);
            imgur.upload(file.path, (err, img) => {
                return Restaurant.findByPk(req.params.id)
                    .then((restaurant) => {
                        restaurant.update({
                            name: req.body.name,
                            tel: req.body.tel,
                            address: req.body.address,
                            opening_hours: req.body.opening_hours,
                            description: req.body.description,
                            image: file ? img.data.link : restaurant.image,
                            CategoryId: req.body.categoryId
                        })
                            .then((restaurant) => {
                                callback({ status: 'success', message: 'restaurant was successfully updated' })
                            })
                    })
            })
        }
        else {
            return Restaurant.findByPk(req.params.id)
                .then((restaurant) => {
                    restaurant.update({
                        name: req.body.name,
                        tel: req.body.tel,
                        address: req.body.address,
                        opening_hours: req.body.opening_hours,
                        description: req.body.description,
                        image: restaurant.image,
                        CategoryId: req.body.categoryId
                    })
                        .then((restaurant) => {
                            callback({ status: 'success', message: 'restaurant was successfully updated' })
                        })
                })
        }
    },
}


module.exports = adminService