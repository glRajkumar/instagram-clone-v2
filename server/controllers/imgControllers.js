const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const upload = require("../middlewares/upload")

router.post('/', auth, upload.single("img"), async (req, res)=>{
    try {
        res.json({img : req.file.filename})
    } catch (error) {
        res.status(400).json({ error, msg: "Image upload failed" })
    }
})

module.exports = router