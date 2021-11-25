const db = require('../models')
const category = require('../models/category')
const Category = db.Category

const categoryService = require('../services/categoryService.js')

let categoryController = {
    getCategories: (req, res) => {
        categoryService.getCategories(req, res, (data) => {
            // console.log(data)
            return res.render('admin/categories', data)
        })
    },
    postCategory: (req, res) => {
        categoryService.postCategory(req, res, (data) => {
            if (data['status' === 'error'])
                req.flash('error_messages', data['message'])
            req.flash('success_messages', data['message'])
            res.redirect('/admin/categories')
        })
    },
    putCategory: (req, res) => {
        categoryService.putCategory(req, res, (data) => {
            if (data['status' === 'error'])
                req.flash('error_messages', data['message'])
            req.flash('success_messages', data['message'])
            res.redirect('/admin/categories')
        })
    },
    deleteCategory: (req, res) => {
        categoryService.deleteCategory(req, res, (data) => {
            if (data['status' === 'error'])
                req.flash('error_messages', data['message'])
            req.flash('success_messages', data['message'])
            res.redirect('/admin/categories')
        })
    }
}
module.exports = categoryController