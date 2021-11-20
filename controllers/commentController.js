const db = require('../models')
const Comment = db.Comment
const helper = require('../_helpers')

const commentController = {
  postComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: helper.getUser(req).id
      })
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (err) {
      console.log(err)
    }
  },
  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = commentController
