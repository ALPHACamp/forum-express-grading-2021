const db = require('../models')
const Category = db.Category
const categoryService = {
  getCategories: async (req, res, cb) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.categoryId) {
        const category = await Category.findByPk(req.params.id)
        cb({
          category: category.toJSON(),
          categories
        })
      }
      return cb({ categories })
    } catch (err) {
      console.log(err)
    }
  },
  postCategory: async (req, res) => {
    try {
      if (!req.body.name) {
        req.flash('error_messages', "name didn't exist")
        return res.redirect('back')
      }
      await Category.create({ name: req.body.name })
      return res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  },
  putCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    try {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      res.redirect('/admin/categories')
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = categoryService
