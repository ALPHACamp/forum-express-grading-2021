const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: async (req, res) => {
    categories = await Category.findAll({ raw: true, nest: true })
    return res.render('admin/categories', { categories })
  },
  postCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    await Category.create({ name: req.body.name })
    return res.redirect('/admin/categories')
  },
}

module.exports = categoryController
