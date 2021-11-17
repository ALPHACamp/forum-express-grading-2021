const db = require('../models')
const Comment = db.Comment

const commentController = {
  postComment: async (req, res) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: req.user.id
      })
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    } catch (err) {
      console.error(err)
    }
  }
}

module.exports = commentController
