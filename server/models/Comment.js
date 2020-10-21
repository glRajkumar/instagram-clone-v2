const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },

    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment