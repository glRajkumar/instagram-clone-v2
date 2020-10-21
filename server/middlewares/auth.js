let jwt = require('jsonwebtoken')
let User = require('../models/User')
require('dotenv').config()

async function auth(req, res, next) {
    try {
        let token = req.headers.authorization.replace('Bearer ', '')
        let payload = jwt.verify(token, process.env.jwtSecretKey)
        let userId = payload.userId

        let user = await User.findById(userId)
        if (!user) return res.status(400).send("User was not found")

        let tokenIndex = user.token.indexOf(token)

        if (tokenIndex > -1) {
            req.user = user
            req.token = token

            next()
        } else {
            return res.status(401).send("Issue with token")
        }
    }
    catch (error) {
        return res.status(401).send("Auth token invalid")
    }
}

module.exports = auth