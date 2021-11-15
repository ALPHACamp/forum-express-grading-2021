const db = require('../models')
const Category = db.Category

const categoryController = {
  getCategories: async (req, res) => {
    const categories = await Category.findAll({ raw: true, nest: true })
    return res.render('admin/categories', { categories })
  }
}

module.exports = categoryController
