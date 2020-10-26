const User = require('../models/User')

async function saved(req, res, next) {
    try {
        const saved = await User.findOne({ _id: req.user._id })
            .select("-_id savedPosts")
        req.saved = saved
        next()
    }
    catch (error) {
        return res.status(401).send("cannot get saved posts")
    }
}

module.exports = saved