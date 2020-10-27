const express = require('express')
const auth = require('../middlewares/auth')
const { following } = require('../middlewares/extra')
const User = require('../models/User')

const router = express.Router()

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

module.exports = router