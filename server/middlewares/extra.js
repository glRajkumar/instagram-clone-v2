const User = require('../models/User')

async function saved(req, res, next) {
    try {
        const { savedPosts } = await User.findOne({ _id: req.user._id })
            .select("-_id savedPosts")
        req.savedPosts = savedPosts
        next()
    }
    catch (error) {
        return res.status(401).send("cannot get saved posts")
    }
}

async function following(req, res, next) {
    try {
        const { following, requested } = await User.findOne({ _id: req.user._id })
            .select('-_id following requested')
            .lean()

        req.following = following
        req.requested = requested
        next()
    }
    catch (error) {
        return res.status(401).send("cannot get following")
    }
}

module.exports = {
    saved,
    following
}