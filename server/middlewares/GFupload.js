const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
require('dotenv').config()

const storage = new GridFsStorage({
    url: process.env.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) return reject(err);

                const fileName = buf.toString('hex') + path.extname(file.originalname);

                const fileInfo = {
                    fileName,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    },
    options: {
        useUnifiedTopology: true
    }
});


const fileFilter = (req, file, cb) => {
    let img = new RegExp('image/*')
    let vid = new RegExp('video/*')
    if (img.test(file.mimetype) || vid.test(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error("not allowed"), false)
    }
}

const upload = multer({ storage, fileFilter })

module.exports = upload