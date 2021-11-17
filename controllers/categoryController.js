const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll({
      raw: true,
      nest: true
    }).then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id).then(category => {
          return res.render('admin/categories', {
            categories,
            category: category.toJSON()
          })
        })
      } else {
        return res.render('admin/categories', { categories })
      }
    })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.create({
      name: req.body.name
    }).then(category => {
      res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    if(!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
    }
    return Category.findByPk(req.params.id).then(category => {
      return category.update({
        name: req.body.name
      }).then(category => {
        return res.redirect('/admin/categories')
      })
    }

    )
  }
}

module.exports = categoryController