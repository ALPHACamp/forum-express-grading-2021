const commentService = require('../Services/commentService')

const commentController = {
  postComment: async (req, res) => {
    commentService.postComment(req, res, data => {
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },
  deleteComment: async (req, res) => {
    commentService.deleteComment(req, res, data => {
      return res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  }
}

module.exports = commentController
