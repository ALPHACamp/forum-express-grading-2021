const db = require('../models')
const Comment = db.Comment
const helper = require('../_helpers')

const commentService = {
  postComment: async (req, res, cb) => {
    try {
      await Comment.create({
        text: req.body.text,
        RestaurantId: req.body.restaurantId,
        UserId: helper.getUser(req).id
      })
      return cb({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  },
  deleteComment: async (req, res, cb) => {
    try {
      const comment = await Comment.findByPk(req.params.id)
      await comment.destroy()
      return cb({ status: 'success', message: '' })
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = commentService
