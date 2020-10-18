const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Post = require("../models/Post")
const User = require('../models/User')

router.get('/onlyphotos/:id', auth, (req, res) => {
    const id = req.params.id
    let skip = parseInt(req.query.skip)

    Post.find({ postedBy: id })
        .select('photo')
        .sort('-createdAt')
        .skip(skip)
        .limit(6)
        .then(pics => {
            res.json({ pics })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/allpost', auth, (req, res) => {
    let skip = parseInt(req.query.skip)

    Post.find()
        .populate("postedBy", "_id name img")
        .populate("comments.postedBy", "_id name img")
        .sort('-createdAt')
        .skip(skip)
        .limit(5)
        .then(posts => {
            res.json({ posts })
        }).catch(err => {
            console.log(err)
        })
})

router.get('/mypost', auth, (req, res) => {
    let skip = parseInt(req.query.skip)

    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name img")
        .populate("comments.postedBy", "_id name img")
        .sort('-createdAt')
        .skip(skip)
        .limit(5)
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.get('/getsubpost', auth, (req, res) => {
    let skip = parseInt(req.query.skip)

    Post.find({ postedBy: { $in: req.user.following } })
        .populate("postedBy", "_id name img")
        .populate("comments.postedBy", "_id name img")
        .sort('-createdAt')
        .skip(skip)
        .limit(5)
        .then(posts => {
            res.json({ posts })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/createpost', auth, async (req, res) => {
    const { title, body, picUrl } = req.body
    const id = req.user._id

    try {
        const post = new Post({
            title,
            body,
            photo: picUrl,
            postedBy: id
        })

        await post.save()
        await User.findByIdAndUpdate(id, { $inc: { totalPosts: 1 } })
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
    const userId = req.user._id

    try {
        await Post.findByIdAndRemove(id)
        await User.findByIdAndUpdate(userId, { $inc: { totalPosts: -1 } })
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