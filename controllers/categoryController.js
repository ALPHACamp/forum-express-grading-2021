const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: async (req, res) => {
    categories = await Category.findAll({ raw: true, nest: true })
    if (req.params.categoryId) {
      let category = await Category.findByPk(req.params.id)
      res.render('/admin/categories', {
        category: category.toJSON(),
        categories,
      })
    }
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
  putCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    let category = await Category.findByPk(req.params.id)
    await category.update(req.body)
    res.redirect('/admin/categories')
  },
  deleteCategory: async (req, res) => {
    let category = await Category.findByPk(req.params.id)
    await category.destroy()
    res.redirect('/admin/categories')
  },
}

module.exports = categoryController
