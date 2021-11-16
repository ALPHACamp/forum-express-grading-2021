const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll({ raw: true, nest: true })

    if (req.params.id) {
      const category = await Category.findByPk(req.params.id)
      return res.render('admin/categories', { categories, category: category.toJSON() })
    } else {
      return res.render('admin/categories', { categories })
    }
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
  },

  putCategory: async (req, res) => {
    const { name } = req.body

    if (!name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }

    const category = await Category.findByPk(req.params.id)
    await category.update({ name })
    return res.redirect('/admin/categories')
  }
}

module.exports = categoryController
