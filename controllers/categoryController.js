const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: async (req, res) => {
    categories = await Category.findAll({ raw: true, nest: true })
    return res.render('admin/categories', { categories })
  },
}

module.exports = categoryController
