let mongoose = require('mongoose')

let Token = mongoose.model('Token', {
    resetPassToken: {
        type: String
    },

    expirePassToken: {
        type: Date
    },

    email: {
        type: String
    }
})

module.exports = Token