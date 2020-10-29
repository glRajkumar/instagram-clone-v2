const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { saved, following } = require('../middlewares/extra')
const Post = require("../models/Post")

router.get('/onlyphotos/:id', auth, async (req, res) => {
    const id = req.params.id
    const skip = parseInt(req.query.skip)
    const pics = []

    try {
        const lists = await Post.find({ postedBy: id })
            .select('-_id files')
            .sort('-createdAt')
            .skip(skip)
            .limit(6)
            .lean()

        lists.map(list => {
            list.files.map(file => {
                pics.push(file)
            })
        })

        res.json({ pics })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get phots" })
    }
})

router.get('/allpost', auth, saved, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find()
            .select('-comments -updatedAt -__v')
            .populate("postedBy", "_id userName img")
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
                isSaved: req.savedPosts.toString().includes(post._id.toString())
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get posts" })
    }
})

router.get('/mypost', auth, saved, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find({ postedBy: req.user._id })
            .select('-comments -updatedAt -__v')
            .populate("postedBy", "_id userName img")
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
                isSaved: req.savedPosts.toString().includes(post._id.toString())
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get posts" })
    }
})

router.get('/heartedpost', auth, saved, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find({ hearted: { $in: req.user._id } })
            .select('-comments -updatedAt -__v')
            .populate("postedBy", "_id userName img")
            .sort('-createdAt')
            .skip(skip)
            .limit(5)
            .lean()

        posts = posts.map(post => {
            return {
                ...post,
                likes: 0,
                hearted: 0,
                isHearted: true,
                isLiked: post.likes.toString().includes(strId),
                isSaved: req.savedPosts.toString().includes(post._id.toString())
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get hearted posts" })
    }
})

router.get('/savedpost', auth, saved, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find({ _id: { $in: req.savedPosts } })
            .select('-comments -updatedAt -__v')
            .populate("postedBy", "_id userName img")
            .sort('-createdAt')
            .skip(skip)
            .limit(5)
            .lean()

        posts = posts.map(post => {
            return {
                ...post,
                likes: 0,
                hearted: 0,
                isSaved: true,
                isLiked: post.likes.toString().includes(strId),
                isHearted: post.hearted.toString().includes(strId)
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get hearted posts" })
    }
})

router.get('/followingpost', auth, following, saved, async (req, res) => {
    const skip = parseInt(req.query.skip)
    const strId = req.user._id.toString()

    try {
        let posts = await Post.find({ postedBy: { $in: req.following } })
            .select('-comments -updatedAt -__v')
            .populate("postedBy", "_id userName img")
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
                isSaved: req.savedPosts.toString().includes(post._id.toString())
            }
        })

        res.json({ posts })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get posts" })
    }
})

router.post('/createpost', auth, async (req, res) => {
    const { title, body, files } = req.body
    let user = req.user

    try {
        const post = new Post({
            title,
            body,
            files,
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

module.exports = router