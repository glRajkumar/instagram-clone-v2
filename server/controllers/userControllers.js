const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const upload = require("../middlewares/GFupload")
const User = require('../models/User')
require('dotenv').config()

const router = express.Router()

router.get('/full', auth, async (req, res) => {
    const userId = req.user._id

    try {
        const user = await User.findById(userId)
            .populate('followers', 'userName')
            .populate('following', 'userName')
            .populate('requested', 'userName')
            .populate('requests', 'userName')
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error, msg: "Cannot find the user" })
    }
})

router.get('/me', auth, async (req, res) => {

    try {
        res.json({ ...req.user._doc })
    } catch (error) {
        res.status(400).json({ error, msg: "Cannot find the user" })
    }
})

router.get('/followers', auth, async (req, res) => {
    const { _id } = req.user

    try {
        const followers = await User.findOne({ _id })
            .select('-_id followers')
            .populate('followers', '_id img userName isPublic')
            .lean()
        res.json({ lists: followers })
    } catch (error) {
        res.status(400).json({ error, msg: "cannot get followers" })
    }
})

router.get('/following', auth, async (req, res) => {
    const { _id } = req.user

    try {
        const following = await User.findOne({ _id })
            .select('-_id following')
            .populate('following', '_id img userName isPublic')
            .lean()
        res.json({ following })
    } catch (error) {
        res.status(400).json({ error, msg: "cannot get following" })
    }
})

router.get('/requests', auth, async (req, res) => {
    const { _id } = req.user

    try {
        const requests = await User.findOne({ _id })
            .select('-_id requests')
            .populate('requests', '_id img userName isPublic')
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
            .populate('requested', '_id img userName isPublic')
            .lean()
        res.json({ requested })
    } catch (error) {
        res.status(400).json({ error, msg: "cannot get requested" })
    }
})

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        const otherUser = await User.findOne({ _id: id })
            .select("-password -token -followers -following -savedPosts -requested -requests -__v")
            .lean()
        const user = await User.findOne({ _id: req.user._id }).select('following').lean()
        const isFollowing = user.following.toString().includes(id)

        res.json({ ...otherUser, isFollowing })

    } catch (error) {
        res.status(400).json({ error, msg: 'cannot get user' })
    }
})

router.post('/register', async (req, res) => {
    const { fullName, userName, email, password } = req.body

    try {
        const userExist = await User.findOne({ email })
        if (userExist) return res.status(400).json({ msg: "Email is already exists" })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        const user = new User({ fullName, userName, email, password: hash })
        await user.save()
        res.json({ msg: "User Saved successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: "User Creation failed" })
    }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
            .select("-followers -following -savedPosts -requested -requests")
        if (!user) return res.status(401).json({ msg: "cannot find user in db" })

        const result = await bcrypt.compare(password, user.password)
        if (!result) return res.status(400).json({ msg: "password not matched" })

        const payload = { userId: user._id }
        const newToken = jwt.sign(payload, process.env.jwtSecretKey, { expiresIn: '18h' })
        user.token = user.token.concat(newToken)
        await user.save()

        const { password: pass, token, __v, ...userDetails } = user._doc

        res.json({ token: newToken, ...userDetails })

    } catch (error) {
        res.status(400).json({ error, msg: "User LogIn failed" })
    }
})

router.put('/public', auth, async (req, res) => {
    const user = req.user

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
    const { oldPass, newPass } = req.body

    try {
        const user = await User.findOne({ "_id": req.user._id })
        if (!user) return res.status(401).json({ msg: "cannot find user in db" })

        const result = await bcrypt.compare(oldPass, user.password)
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
    const userPattern = new RegExp("^" + req.body.query)

    try {
        const user = await User.find({ email: { $regex: userPattern } }).select("_id email")
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error, msg: 'cannot search' })
    }
})

router.post("/logout", auth, async (req, res) => {
    const { user, token } = req

    try {
        await User.updateOne({ _id: user._id }, { $pull: { token } })
        res.json({ msg: "User logged out successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "User log out failed" })
    }
})

module.exports = router