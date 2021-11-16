const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })

      if (req.params.id) {
        const category = await Category.findByPk(req.params.id)
        return res.render('admin/categories', { categories, category: category.toJSON() })
      }

      return res.render('admin/categories', { categories })
    } catch (err) {
      console.error(err)
    }
  },

  postCategory: async (req, res) => {
    try {
      const { name } = req.body

      if (!name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      }

      await Category.create({ name })
      req.flash('success_messages', 'category was successfully created')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.error(err)
    }
  },

  putCategory: async (req, res) => {
    try {
      const { name } = req.body

      if (!name) {
        req.flash('error_messages', 'name didn\'t exist')
        return res.redirect('back')
      }

      const category = await Category.findByPk(req.params.id)
      await category.update({ name })
      req.flash('success_messages', 'category was successfully edited')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.error(err)
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      req.flash('success_messages', 'category was successfully deleted')
      return res.redirect('/admin/categories')
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = categoryController
