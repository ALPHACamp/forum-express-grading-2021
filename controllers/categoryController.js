const db = require('../models')
const Category = db.Category
let categoryController = {
  getCategories: (req, res) => {
    //找出所有的分類並且pares
    return Category.findAll({
      raw: true,
      nest: true
      //然後存進categories變數
    }).then(categories => {
      //如果網址上有:id，尋找單筆分類，就會傳入動態變數
      if (req.params.id) {
        Category.findByPk(req.params.id)
          //再多抓一個變數存入category(這個就是單筆分類)
          .then((category) => {
            //然後將這筆資料傳給view
            return res.render('admin/categories', {
              categories: categories,
              category: category.toJSON()
            })
          })
        //沒有的話就是直接render分類
      } else {
        return res.render('admin/categories', {
          categories: categories
        })
      }
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
  putCategory: (req, res) => {
    //如果沒有輸入資料顯示錯誤訊息
    if (!req.body.name) {
      req.flash('error_messages', 'name didn\'t exist')
      return res.redirect('back')
      //反之將新設立的分類名稱存入Category
    } else {
      return Category.findByPk(req.params.id)
        //然後這個新分類名稱會更新再整個表單中
        .then((category) => {
          category.update(req.body)
            //然後重新渲染回分類頁面
            .then((category) => {
              res.redirect('/admin/categories')
            })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  }

}
module.exports = categoryController