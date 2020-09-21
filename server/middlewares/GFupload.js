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
    }
});

const upload = multer({ storage });

module.exports = upload