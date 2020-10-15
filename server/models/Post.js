const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    body: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        required: true
    },

    hearted: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    likesCount: {
        type: Number,
        default: 0,
    },

    comments: [{
        text: String,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    }],

    commentsCount: {
        type: Number,
        default: 0,
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Post = mongoose.model('Post', postSchema)

module.exports = Post