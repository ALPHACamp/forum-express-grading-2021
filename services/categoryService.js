const db = require('../models')
const Category = db.Category

const categoryService = {
    getCategories: (req, res, callback) => {
        return Category.findAll({
            raw: true,
            nest: true
        }).then(categories => {
            if (req.params.id) {
                Category.findByPk(req.params.id)
                    .then(category => {
                        callback({ categories: categories, category: category.toJSON() })
                    })
            } else {
                callback({ categories: categories })
            }
        })
    },

    deleteCategory: (req, res, callback) => {
        console.log('成功調用 api')
        return Category.findByPk(req.params.id)
            .then((category) => {
                category.destroy()
                    .then((category) => {
                        // res.redirect('/admin/categories')
                        callback({ status: 'success', message: 'category was successfully deleted' })
                    })
                    .catch(error => {
                        console.log(error)
                        callback({ status: 'error', message: 'category was not successfully deleted' })
                    })
            })
    }
}

module.exports = categoryService