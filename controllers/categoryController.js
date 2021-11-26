const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      return res.render('admin/categories', { categories })
    })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          res.redirect('/admin/categories')
        })
    }
  },
  getCategories: async (req, res) => {
    const categories = await Category.findAll({
      raw: true,
      nest: true
    })
    if (req.params.id) {
      const category = await Category.findByPk(req.params.id)
      return res.render('admin/categories', { categories, category: category.toJSON() })
    } else {
      return res.render('admin/categories', { categories })
    }
  },
  putCategory: async (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    } else {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      res.redirect('/admin/categories')
    }
  },
  deleteCategory: async (req, res) => {

    const category = await Category.findByPk(req.params.id)
    await category.destroy()
    res.redirect('/admin/categories')
  }
}
module.exports = categoryController