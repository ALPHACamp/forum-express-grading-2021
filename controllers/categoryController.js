const db = require('../models')
const Category = db.Category
const categoryService = require('../services/categoryService')

let categoryController = {
    getCategories: (req, res) => {
        categoryService.getCategories(req, res, data => {
            if (req.params.id) {
                return res.render('admin/categories', data)
            } else {
                return res.render('admin/categories', data)
            }
        })
    },

    postCategory: (req, res) => {
        categoryService.postCategory(req, res, (data) => {
            if (data["status"] === 'error') {
                req.flash('error_messages', 'name didn\'t exist')
                return res.redirect('back')
            }
            req.flash('success_messages', 'category is successfully created')
            res.redirect('/admin/categories')
        })
    },

    putCategory: (req, res) => {
        categoryService.putCategory(req, res, (data) => {
            if (data['status'] === 'error') {
                req.flash('error_messages', `name didn\'t exist`)
                return res.redirect('back')
            } else {
                res.redirect('/admin/categories')
            }

        })
    },

    deleteCategory: (req, res) => {
        categoryService.deleteCategory(req, res, (data) => {
            if (data['status'] === 'success') {
                res.redirect('/admin/categories')
            }
        })
    },

}


module.exports = categoryController