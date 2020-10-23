let mongoose = require('mongoose')

let User = mongoose.model('User', {
    fullName: {
        type: String,
        required: [true, "Name is required"],
        minlength: [3, "Name should atleast 3 letter"]
    },

    userName: {
        type: String,
        required: [true, "Please enter your username"],
        trim: true,
        unique: true,
    },

    isPublic: {
        type: Boolean,
        default: true
    },

    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        match: [/\S+@\S+\.\S+/, "Email is not valid"]
    },

    img: {
        type: String,
        default: null
    },

    password: {
        type: String,
        required: [true, "Password is required"]
    },

    token: [{ type: String }],

    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    followersCount: {
        type: Number,
        default: 0
    },

    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    followingCount: {
        type: Number,
        default: 0
    },

    totalPosts: {
        type: Number,
        default: 0
    },

    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],

    requested: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    requests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

module.exports = User