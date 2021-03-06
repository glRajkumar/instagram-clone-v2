const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Post = require("../models/Post")

router.get('/onlyphotos/:id', auth, async (req, res) => {
    const id = req.params.id
    const skip = parseInt(req.query.skip)

    try {

        const pics = await Post.find({ postedBy: id })
            .select('photo')
            .sort('-createdAt')
            .skip(skip)
            .limit(6)
            .lean()

        res.json({ pics })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get phots" })
    }
})

router.get('/allpost', auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find()
            .populate("postedBy", "_id userName img")
            .populate("comments.postedBy", "_id userName img")
            .sort('-createdAt')
            .skip(skip)
            .limit(5)
            .lean()

        posts = posts.map(post => {
            return {
                ...post,
                likes: 0,
                hearted: 0,
                isLiked: post.likes.toString().includes(strId),
                isHearted: post.hearted.toString().includes(strId),
                isSaved: req.user.savedPosts.toString().includes(post._id.toString())
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get posts" })
    }
})

router.get('/mypost', auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find({ postedBy: req.user._id })
            .populate("postedBy", "_id userName img")
            .populate("comments.postedBy", "_id userName img")
            .sort('-createdAt')
            .skip(skip)
            .limit(5)
            .lean()

        posts = posts.map(post => {
            return {
                ...post,
                likes: 0,
                hearted: 0,
                isLiked: post.likes.toString().includes(strId),
                isHearted: post.hearted.toString().includes(strId),
                isSaved: req.user.savedPosts.toString().includes(post._id.toString())
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get posts" })
    }
})

router.get('/getsubpost', auth, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find({ postedBy: { $in: req.user.following } })
            .populate("postedBy", "_id userName img")
            .populate("comments.postedBy", "_id userName img")
            .sort('-createdAt')
            .skip(skip)
            .limit(5)
            .lean()

        posts = posts.map(post => {
            return {
                ...post,
                likes: 0,
                hearted: 0,
                isLiked: post.likes.toString().includes(strId),
                isHearted: post.hearted.toString().includes(strId),
                isSaved: req.user.savedPosts.toString().includes(post._id.toString())
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get posts" })
    }
})

router.post('/createpost', auth, async (req, res) => {
    const { title, body, picUrl } = req.body
    let user = req.user

    try {
        const post = new Post({
            title,
            body,
            photo: picUrl,
            postedBy: req.user._id
        })

        await post.save()
        user.totalPosts = user.totalPosts + 1
        await user.save()

        res.json({ msg: "Post saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Post not saved in db" })
    }
})

router.put('/hearted', auth, async (req, res) => {
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, { $push: { hearted: id } })
        res.json({ msg: 'hearted successfully' })

    } catch (error) {
        res.status(400).json({ error, msg: 'hearted action failed' })
    }
})

router.put('/unhearted', auth, async (req, res) => {
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, { $pull: { hearted: id } })
        res.json({ msg: 'unhearted successfully' })

    } catch (error) {
        res.status(400).json({ error, msg: 'unhearted action failed' })
    }
})

router.put('/like', auth, async (req, res) => {
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, { $push: { likes: id }, $inc: { likesCount: 1 } })
        res.json({ msg: 'liked successfully' })

    } catch (error) {
        res.status(400).json({ error, msg: 'like action failed' })
    }
})

router.put('/unlike', auth, async (req, res) => {
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, { $pull: { likes: id }, $inc: { likesCount: -1 } })
        res.json({ msg: 'unliked successfully' })

    } catch (error) {
        res.status(400).json({ error, msg: 'unliked action failed' })
    }
})

router.put('/comment', auth, async (req, res) => {
    const { postId } = req.body
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }

    try {
        const post = await Post.findByIdAndUpdate(postId,
            { $push: { comments: comment }, $inc: { commentsCount: 1 } },
            { new: true }).select('comments._id')

        let last = post.comments.length - 1
        let newId = post.comments[last]._id
        res.json({ newId, msg: 'commented successfully' })

    } catch (error) {
        res.status(400).json({ error, msg: 'comment action failed' })
    }
})

router.delete('/comment', auth, async (req, res) => {
    const { postId, commentId } = req.body

    try {
        await Post.findByIdAndUpdate(postId,
            { $pull: { comments: { _id: commentId } }, $inc: { commentsCount: -1 } })
        res.json({ msg: " comment deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: 'delete action failed' })
    }
})

router.delete('/:postId', auth, async (req, res) => {
    const id = req.params.postId
    let user = req.user

    try {
        await Post.findByIdAndRemove(id)
        user.totalPosts = user.totalPosts - 1
        await user.save()

        res.json({ msg: "deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: 'delete action failed' })
    }
})

router.delete('/', auth, async (req, res) => {
    const userId = req.user._id

    try {
        await Post.deleteMany({ postedBy: userId })
        res.json({ msg: "all posts deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: 'all posts delete action failed' })
    }
})

module.exports = router