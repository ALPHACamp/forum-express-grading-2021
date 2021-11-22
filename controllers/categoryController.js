const db = require('../models')
const Category = db.Category
const categoryService = require('../Services/categoryService')
const categoryController = {
  getCategories: async (req, res) => {
    categoryService.getCategories(req, res, data => {
      return res.render('admin/categories', data)
    })
  },
  postCategory: async (req, res) => {
    categoryService.postCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      return res.redirect('/admin/categories')
    })
  },
  putCategory: async (req, res) => {
    categoryService.putCategory(req, res, data => {
      if (data.status === 'error') {
        req.flash('error_messages', data.message)
        return res.redirect('back')
      }
      return res.redirect('/admin/categories')
    })
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

module.exports = categoryController
