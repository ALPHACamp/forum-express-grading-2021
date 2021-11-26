const db = require('../../models')
const Restaurant = db.Restaurant
const Category = db.Category
const adminService = require('../../services/adminService')
const imgur = require('imgur-node-api')
// const { userInfo } = require('os')
const IMGUR_CLIENT_ID = '0f45c06002b9fdc'

const adminController = {
    getRestaurants: (req, res) => {
        adminService.getRestaurants(req, res, data => {
            return res.json(data)
        })
    },

    getRestaurant: (req, res) => {
        adminService.getRestaurant(req, res, (data) => {
            return res.json(data)
        })
    },

    postRestaurant: (req, res) => {
        console.log('進入 api postRestaurant')
        adminService.postRestaurant(req, res, (data) => {
            console.log('進入 api adminService.postRestaurant')
            return res.json(data)
        })
    },

    deleteRestaurant: (req, res) => {
        adminService.deleteRestaurant(req, res, (data) => {
            return res.json(data)
        })
    },

    putRestaurant: (req, res) => {
        adminService.putRestaurant(req, res, (data) => {
            return res.json(data)
        })
    }

}


module.exports = adminController