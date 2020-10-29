const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const mongoose = require('mongoose')
const upload = require('../middlewares/GFupload')

const options = {
    bucketName: 'uploads'
}

//Get the Single image
router.get('/:filename', (req, res) => {
    const gfB = new mongoose.mongo.GridFSBucket(mongoose.connection.db, options)

    const d = gfB.openDownloadStreamByName(req.params.filename)

    d.on("data", (chunk) => { res.write(chunk) })

    d.on("error", (err) => { res.json({ err }) })

    d.on("end", () => { res.end() })
});

router.post('/', auth, upload.array('files', 10), async (req, res) => {
    try {
        const names = req.files.map(file => {
            return {
                fileName: file.filename,
                fileType: file.mimetype,
            }
        })
        res.json({ names });

    } catch (error) {
        res.status(400).json({ error, msg: "files upload failed" })
    }
})

module.exports = router