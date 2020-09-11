const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null, './upload/')
    },
    filename : function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname)
    } 
})

const fileFilter = (req, file, cb) =>{
    //reject file
    if(file.mimetype === "image/jpeg" || file.mimetype === "image/png"){
        cb(null, true)
    }else{
        cb(new Error("not allowed"), false)
    }
}

const upload = multer({storage, fileFilter})

module.exports = upload