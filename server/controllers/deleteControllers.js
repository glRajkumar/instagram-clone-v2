const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const User = require('../models/User')
const Post = require("../models/Post")
const Comment = require('../models/Comment')

router.delete('/', auth, async (req, res) => {
    const userId = req.user._id

    try {
        await User.findByIdAndRemove(userId)
        await Post.deleteMany({ postedBy: userId })
        await Comment.deleteMany({ postedBy: userId })
        res.json({ msg: "Everything deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: 'Everything delete action failed' })
    }
})

module.exports = router