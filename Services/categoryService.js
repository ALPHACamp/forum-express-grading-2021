const db = require('../models')
const Category = db.Category
const categoryService = {
  getCategories: async (req, res, cb) => {
    try {
      const categories = await Category.findAll({ raw: true, nest: true })
      if (req.params.id) {
        const category = (await Category.findByPk(req.params.id)).toJSON()
        return cb({
          category,
          categories
        })
      }
      return cb({ categories })
    } catch (err) {
      console.log(err)
    }
  },
  postCategory: async (req, res, cb) => {
    try {
      if (!req.body.name) {
        return cb({ status: 'error', message: "name didn't exist" })
      }
      await Category.create({ name: req.body.name })
      return cb({ status: 'success', message: 'create category successfully' })
    } catch (err) {
      console.log(err)
    }
  },
  putCategory: async (req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name didn't exist" })
    }
    try {
      const category = await Category.findByPk(req.params.id)
      await category.update(req.body)
      return cb({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  deleteCategory: async (req, res, cb) => {
    try {
      const category = await Category.findByPk(req.params.id)
      await category.destroy()
      return cb({ status: 'success', message: 'delete category successfully' })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = categoryService
