const helpers = require('../_helpers')
const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: helpers.getUser(req).id
      })
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (err) {
      console.error(err)
    }
  },

  deleteComment: async (req, res) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      return res.redirect(`/restaurants/${comment.RestaurantId}`)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = commentController
