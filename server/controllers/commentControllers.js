const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Comment = require('../models/Comment')
const Post = require("../models/Post")

router.get('/:postId', auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const { postId } = req.params

    try {
        const comments = await Comment.find({ 'post': postId })
            .populate('postedBy', "_id userName img")
            .sort('-createdAt')
            .skip(skip)
            .limit(5)
            .lean()

        res.json({ comments })

    } catch (error) {
        res.status(400).json({ error, msg: 'cannot get comments' })
    }
})

router.post('/', auth, async (req, res) => {
    const { text, postId } = req.body

    try {
        const comment = new Comment({
            text,
            post: postId,
            postedBy: req.user._id
        })

        await comment.save()
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id }, $inc: { commentsCount: 1 } })

        res.json({ comment, msg: 'commented successfully' })

    } catch (error) {
        res.status(400).json({ error, msg: 'comment action failed' })
    }
})

router.put('/', auth, async (req, res) => {
    const { text, commentId } = req.body

    try {
        await Comment.findByIdAndUpdate(commentId, { text })
        res.json({ msg: 'comment updated successfully' })

    } catch (error) {
        res.status(400).json({ error, msg: 'comment update action failed' })
    }
})

router.delete('/', auth, async (req, res) => {
    const { postId, commentId } = req.body

    try {
        await Comment.findByIdAndRemove(commentId)
        await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId }, $inc: { commentsCount: -1 } })
        res.json({ msg: " comment deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: 'delete action failed' })
    }
})

module.exports = router