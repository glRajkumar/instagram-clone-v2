let jwt = require('jsonwebtoken')
let User = require('../models/User')
require('dotenv').config()

async function auth(req, res, next){
    try{
        let token = req.headers.authorization.replace('Bearer ', '')
        let payload = jwt.verify(token, process.env.jwtSecretKey)
        let userId = payload.userId

        let user = await User.findById(userId)
        let tokenIndex = user.token.indexOf(token)
        if(!user) res.status(400).send("User was not found")

        if( tokenIndex > -1){
            req.user = user
            req.token = token
            
            next()
        }else{
            res.status(401).send("Issue with token")
        }
    }
    catch(error){
        res.status(401).send("Auth token invalid")
    }
}

module.exports = auth