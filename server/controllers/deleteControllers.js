const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const User = require('../models/User')
const Post = require("../models/Post")
const Comment = require('../models/Comment')

router.delete('/', auth, async (req, res) => {
    const userId = req.user._id

    try {
        await User.updateMany({ followers: userId }, {
            $pull: { followers: userId },
            $inc: { followersCount: -1 }
        })
        await User.updateMany({ following: userId }, {
            $pull: { following: userId },
            $inc: { followingCount: -1 }
        })
        await User.updateMany({ requested: userId }, {
            $pull: { requested: userId }
        })
        await User.updateMany({ requests: userId }, {
            $pull: { requests: userId }
        })
        await Post.updateMany({ likes: userId }, {
            $pull: { likes: userId },
            $inc: { likesCount: -1 }
        })
        await Post.updateMany({ comments: userId }, {
            $inc: { commentsCount: -1 }
        })
        await User.findByIdAndRemove(userId)
        await Post.deleteMany({ postedBy: userId })
        await Comment.deleteMany({ postedBy: userId })
        res.json({ msg: "Everything deleted successfully" })

    } catch (error) {
        res.status(400).json({ error, msg: 'Everything delete action failed' })
    }
})

module.exports = router