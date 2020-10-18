const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const upload = require("../middlewares/GFupload")
const User = require('../models/User')
const Token = require('../models/Token')
const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

router.get('/me', auth, async (req, res) => {
    const id = req.user._id

    try {
        const user = await User.findOne({ _id: id }).select("-password -token")
        res.json({ user })
    } catch (error) {
        res.status(400).json({ error, msg: "Cannot find the user" })
    }
})

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id

    try {
        const user = await User.findOne({ _id: id }).select("-password -token")
        res.json({ user })
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

        user = {
            _id: user._id,
            fullName: user.fullName,
            userName: user.userName,
            email: user.email,
            img: user.img,
            followers: user.followers,
            followersCount: user.followersCount,
            following: user.following,
            followingCount: user.followingCount,
            totalPosts: user.totalPosts,
            savedPosts: user.savedPosts
        }

        res.json({ token, user })

    } catch (error) {
        res.status(400).json({ error, msg: "User LogIn failed" })
    }
})

router.put('/update-img', auth, upload.single("img"), async (req, res) => {
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
        await User.findByIdAndUpdate(followId, { $push: { followers: id }, $inc: { followersCount: 1 } })
        await User.findByIdAndUpdate(id, { $push: { following: followId }, $inc: { followingCount: 1 } })
        res.json({ msg: "follow action saved successfully" })
    } catch (error) {
        res.status(400).json({ error, msg: "follow action failed" })
    }
})

router.put('/unfollow', auth, async (req, res) => {
    const { unfollowId } = req.body
    const id = req.user._id

    try {
        await User.findByIdAndUpdate(unfollowId, { $pull: { followers: id }, $inc: { followersCount: -1 } })
        await User.findByIdAndUpdate(id, { $pull: { following: unfollowId }, $inc: { followingCount: -1 } })
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

router.put('/update-password', auth, async (req, res) => {
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

router.post('/reset-password', async (req, res) => {
    const { email } = req.body

    try {
        const buffer = crypto.randomBytes(32).toString("hex")
        if (!buffer) return console.log(buffer)
        const resetPassToken = buffer

        const user = await User.findOne({ email })
        if (!user) return res.status(422).json({ msg: "User dont exists with that email" })

        const token = new Token({ resetPassToken, expirePassToken: Date.now() + 3600000, email })
        await token.save()

        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL,
            subject: "password reset",
            html: `
            <p>You requested for password reset</p>
            <h5>copy the following token to reset the password</h5>
            <br />
            <h2>${resetPassToken}</h2>
            <br /> `
        })
        // if (info) console.log("email send " + info.response) -- to check mailer is working
        res.json({ msg: "check your email" })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot reset password" })
    }
})

router.post('/new-password', async (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    try {
        const token = await Token.findOne({ resetPassToken: sentToken, expirePassToken: { $gt: Date.now() } })
        if (!token) return res.status(422).json({ error: "Try again session expired" })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)

        const user = await User.findOne({ email: token.email })
        user.password = hash
        await user.save()

        res.json({ msg: "password updated success" })

    } catch (error) {
        res.status(400).json({ error, msg: 'cannot set new password' })
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

router.delete("/", auth, async (req, res) => {
    let _id = req.user._id

    try {
        await User.findByIdAndRemove(_id)
        res.send("User delete successfully")
    } catch (error) {
        res.status(400).json({ error, msg: "User deletion failed" })
    }
})

module.exports = router