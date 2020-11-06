const express = require('express')
const auth = require('../middlewares/auth')
const { following } = require('../middlewares/extra')
const User = require('../models/User')

const router = express.Router()

router.get('/username/:name', async (req, res) => {
    const name = req.params.name

    try {
        const user = await User.findOne({ userName: name }).select("_id")
        if (user) return res.status(400).json({ msg: 'username already exist' })
        res.json({ msg: "username is available", name })

    } catch (error) {
        res.status(400).json({ error, msg: 'cannot check username existence' })
    }
})

router.get('/suggestions', auth, following, async (req, res) => {
    const skip = parseInt(req.query.skip)

    try {
        const notSelect = [req.user._id, ...req.following, ...req.requested]
        const ids = await User.find({ _id: { $nin: notSelect } })
            .select('_id userName img isPublic')
            .skip(skip)
            .limit(10)
            .lean()

        const lists = ids.map(id => {
            return {
                ...id,
                isFollowing: false,
                isRequested: false
            }
        })

        res.json({ lists })
    } catch (error) {
        res.status(400).json({ error, msg: 'cannot get user' })
    }

})

router.get('/:id', auth, following, async (req, res) => {
    const id = req.params.id

    try {
        const otherUser = await User.findOne({ _id: id })
            .select("-password -token -followers -following -savedPosts -requested -requests -__v")
            .lean()

        const isFollowing = req.following.toString().includes(id)
        const isRequested = req.requested.toString().includes(id)

        res.json({ ...otherUser, isFollowing, isRequested })

    } catch (error) {
        res.status(400).json({ error, msg: 'cannot get user' })
    }
})

router.get('/followers/:id', auth, following, async (req, res) => {
    const id = req.params.id

    try {
        const { followers } = await User.findOne({ _id: id })
            .select('-_id followers')
            .populate('followers', '_id img userName isPublic')
            .lean()

        const lists = followers.map(f => {
            return {
                ...f,
                isFollowing: req.following.toString().includes(f._id.toString()),
                isRequested: req.requested.toString().includes(f._id.toString())
            }
        })

        res.json({ lists })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get followers" })
    }
})

router.get('/following/:id', auth, following, async (req, res) => {
    const id = req.params.id

    try {
        const { following } = await User.findOne({ _id: id })
            .select('-_id following')
            .populate('following', '_id img userName isPublic')
            .lean()

        const lists = following.map(f => {
            return {
                ...f,
                isFollowing: req.following.toString().includes(f._id.toString()),
                isRequested: req.requested.toString().includes(f._id.toString())
            }
        })

        res.json({ lists })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot get following" })
    }
})

router.post('/search', auth, async (req, res) => {
    const userPattern = new RegExp("^" + req.body.query)

    try {
        const user = await User.find({ userName: { $regex: userPattern } }).select("_id img userName")
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error, msg: 'cannot search' })
    }
})

module.exports = router