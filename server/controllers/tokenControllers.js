const crypto = require('crypto')
const express = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const Token = require('../models/Token')
const User = require('../models/User')

const router = express.Router()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }
})

router.post('/reset', async (req, res) => {
    const { email } = req.body

    try {
        const buffer = crypto.randomBytes(32).toString("hex")
        if (!buffer) return console.log(buffer)
        const resetPassToken = buffer

        const user = await User.findOne({ email })
        if (!user) return res.status(422).json({ msg: "User doesn't exists with that email" })

        const token = new Token({ resetPassToken, expirePassToken: Date.now() + 3600000, email })
        await token.save()

        await transporter.sendMail({
            to: email,
            from: process.env.EMAIL,
            subject: "password reset",
            html: `
            <p>You requested for password reset</p>
            <h5>copy the following token to reset the password</h5>
            <br />
            <h2>${resetPassToken}</h2>
            <br /> `
        })
        // if (info) console.log("email send " + info.response) -- to check mailer is working
        res.json({ msg: "check your email" })

    } catch (error) {
        res.status(400).json({ error, msg: "cannot reset password" })
    }
})

router.post('/new', async (req, res) => {
    const newPassword = req.body.password
    const sentToken = req.body.token

    try {
        const token = await Token.findOne({ resetPassToken: sentToken, expirePassToken: { $gt: Date.now() } })
        if (!token) return res.status(422).json({ error: "Try again session expired" })

        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPassword, salt)

        const user = await User.findOne({ email: token.email })
        user.password = hash
        await user.save()

        res.json({ msg: "password updated success" })

    } catch (error) {
        res.status(400).json({ error, msg: 'cannot set new password' })
    }
})

module.exports = router