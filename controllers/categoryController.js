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
    categoryService.deleteCategory(req, res, data => {
      return res.redirect('/admin/categories')
    })
  }
}

module.exports = categoryController
