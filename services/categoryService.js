const db = require('../models')
const Category = db.Category

let categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({
        raw: true,
        next: true
    })
    .then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
          .then((category) => {
            // console.log(category)
            return res.render('admin/categories', { 
                categories: categories, 
                category: category.toJSON() 
            })
        })
      } else {
        callback({ categories: categories })
      }
    })
  },
  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({status: 'error', message: 'name does not exist'}) 
        // req.flash('error_messages', 'name didn\'t exist')
        // return res.redirect('back')
    } 
    else {
      return Category.create({
          name: req.body.name
      })
      .then((category) => {
        return callback({status: 'success', message: 'Category was successfully created'})
          // res.redirect('/admin/categories')
      })
    }
  },
  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      return callback({status: 'error', message: 'name does not exist'})
      // req.flash('error_messages', 'name didn\'t exist')
      // return res.redirect('back')
    } 
    else {
      return Category.findByPk(req.params.id)
      .then((category) => {
        category.update(req.body)
          .then((category) => {
            return callback({status: 'success', message: 'Category was successfully created'})
            // res.redirect('/admin/categories')
          })
      })
    }
  },
  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
        .then((category) => {
          return callback({status: 'success', message: 'Category was successfully deleted'})
          // res.redirect('/admin/categories')
        })
    })
  }
}
module.exports = categoryService 