const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll({ raw: true, nest: true })
    return res.render('admin/categories', { categories })
  },

  postCategory: async (req, res) => {
    const { name } = req.body

    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }

    await Category.create({ name })
    req.flash('success_messages', 'category was successfully created')
    return res.redirect('/admin/categories')
  }
}

module.exports = categoryController
