const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const upload = require("../middlewares/GFupload")
const User = require('../models/User')
require('dotenv').config()

const router = express.Router()

router.get('/full', auth, async (req, res) => {
    let user = req.user

    try {
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error, msg: "Cannot find the user" })
    }
})

router.get('/me', auth, async (req, res) => {
    const { _id, fullName, userName, isPublic, email, img, followersCount, followingCount, totalPosts } = req.user

    try {
        res.json({ _id, fullName, userName, isPublic, email, img, followersCount, followingCount, totalPosts })
    } catch (error) {
        res.status(400).json({ error, msg: "Cannot find the user" })
    }
})

router.get('/requests', auth, async (req, res) => {
    const { _id } = req.user

    try {
        const requests = await User.findOne({ _id })
            .select('-_id requests')
            .populate('requests', '_id img userName')
            .lean()
        res.json({ requests })
    } catch (error) {
        res.status(400).json({ error, msg: "cannot get requests" })
    }
})

router.get('/requested', auth, async (req, res) => {
    const { _id } = req.user

    try {
        const requested = await User.findOne({ _id })
            .select('-_id requested')
            .populate('requested', '_id img userName')
            .lean()
        res.json({ requested })
    } catch (error) {
        res.status(400).json({ error, msg: "cannot get requested" })
    }
})

router.get('/:id', auth, async (req, res) => {
    const userMe = req.user
    const id = req.params.id

    try {
        const otherUser = await User.findOne({ _id: id })
            .select("-password -token -followers -following -savedPosts -requested -requests")
            .lean()
        const isFollowing = userMe.following.includes(id)
        res.json({ otherUser, isFollowing })

    } catch (error) {
        res.status(400).json({ error, msg: 'cannot get user' })
    }
})

router.post('/register', async (req, res) => {
    let { fullName, userName, email, password } = req.body

    try {
        const userExist = await User.findOne({ email })
        if (userExist) return res.status(400).json({ msg: "Email is already exists" })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        let user = new User({ fullName, userName, email, password: hash })
        await user.save()
        res.json({ msg: "User Saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "User Creation failed" })
    }
})

router.post('/login', async (req, res) => {
    let { email, password } = req.body

    try {
        let user = await User.findOne({ email })
        if (!user) return res.status(401).json({ msg: "cannot find user in db" })

        let result = await bcrypt.compare(password, user.password)
        if (!result) return res.status(400).json({ msg: "password not matched" })

        let payload = { userId: user._id }
        let token = jwt.sign(payload, process.env.jwtSecretKey, { expiresIn: '18h' })
        user.token = user.token.concat(token)
        await user.save()

        let { _id, fullName, userName, isPublic, img, followersCount, followingCount, totalPosts } = user

        res.json({ token, _id, fullName, isPublic, userName, img, followersCount, followingCount, totalPosts })

    } catch (error) {
        res.status(400).json({ error, msg: "User LogIn failed" })
    }
})

router.put('/public', auth, async (req, res) => {
    let user = req.user

    try {
        user.isPublic = !user.isPublic
        await user.save()
        res.json({ msg: "public action successful" })
    } catch (error) {
        res.status(400).json({ error, msg: "public action failed" })
    }
})

router.put('/img', auth, upload.single("img"), async (req, res) => {
    const id = req.user._id
    const img = req.file.filename

    try {
        await User.findByIdAndUpdate(id, { $set: { img } })
        res.json({ img })
    } catch (error) {
        res.status(400).json({ error, msg: "img not saved" })
    }
})

router.put('/follow', auth, async (req, res) => {
    const { followId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(followId, {
            $push: { followers: id },
            $inc: { followersCount: 1 }
        })
        await User.findByIdAndUpdate(id, {
            $push: { following: followId },
            $inc: { followingCount: 1 }
        })
        res.json({ msg: "follow action saved successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "follow action failed" })
    }
})

router.put('/unfollow', auth, async (req, res) => {
    const { unfollowId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(unfollowId, {
            $pull: { followers: id },
            $inc: { followersCount: -1 }
        })
        await User.findByIdAndUpdate(id, {
            $pull: { following: unfollowId },
            $inc: { followingCount: -1 }
        })
        res.json({ msg: "unfollow action saved successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "unfollow action failed" })
    }
})

router.put('/savepost', auth, async (req, res) => {
    const { postId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(id, { $push: { savedPosts: postId } })
        res.json({ msg: "Post saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Post not saved in db" })
    }
})

router.put('/unsavepost', auth, async (req, res) => {
    const { postId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(id, { $pull: { savedPosts: postId } })
        res.json({ msg: "Post unsaved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "Post not unsaved in db" })
    }
})

router.put('/requests', auth, async (req, res) => {
    const { reqId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(reqId, { $push: { requests: id } })
        await User.findByIdAndUpdate(id, { $push: { requested: reqId } })
        res.json({ msg: "requests action saved successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "requests action failed" })
    }
})

router.put('/cancel-req', auth, async (req, res) => {
    const { reqId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(reqId, { $pull: { requests: id } })
        await User.findByIdAndUpdate(id, { $pull: { requested: reqId } })
        res.json({ msg: "cancel-req action saved successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "cancel-req action failed" })
    }
})

router.put('/accept-req', auth, async (req, res) => {
    const { reqId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(id, {
            $push: { followers: reqId },
            $pull: { requests: reqId },
            $inc: { followersCount: 1 }
        })
        await User.findByIdAndUpdate(reqId, {
            $push: { following: id },
            $pull: { requested: id },
            $inc: { followingCount: 1 }
        })
        res.json({ msg: 'accept-req request accepted successfully' })
    } catch (error) {
        res.status(400).json({ error, msg: "accept-req request accepted action failed" })
    }
})

router.put('/decline-req', auth, async (req, res) => {
    const { reqId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(id, { $pull: { requests: reqId } })
        await User.findByIdAndUpdate(reqId, { $pull: { requested: id } })
        res.json({ msg: 'decline-req request declined successfully' })
    } catch (error) {
        res.status(400).json({ error, msg: "decline-req request declined action failed" })
    }
})

router.put('/password', auth, async (req, res) => {
    let { oldPass, newPass } = req.body

    try {
        const user = await User.findOne({ "_id": req.user._id })
        if (!user) return res.status(401).json({ msg: "cannot find user in db" })

        let result = await bcrypt.compare(oldPass, user.password)
        if (!result) return res.status(400).json({ msg: "password not matched" })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPass, salt)
        user.password = hash
        await user.save()
        res.json({ msg: "User password saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "User password update failed" })
    }
})

router.post('/search-users', async (req, res) => {
    let userPattern = new RegExp("^" + req.body.query)

    try {
        const user = await User.find({ email: { $regex: userPattern } }).select("_id email")
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error, msg: 'cannot search' })
    }
})

router.post("/logout", auth, async (req, res) => {
    let { user, token } = req

    try {
        user.token = user.token.filter(t => t != token)
        await user.save()
        res.json({ msg: "User logged out successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "User log out failed" })
    }
})

module.exports = router