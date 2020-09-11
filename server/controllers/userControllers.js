const crypto = require('crypto')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const auth = require('../middlewares/auth')
const upload = require("../middlewares/upload")
const User = require('../models/User')
const Post =  require("../models/Post")
const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.EMAIL,
        pass : process.env.PASS
    }
})

router.post('/register', async (req,res) => {
    let {name, email, password} = req.body

    try {
        const userExist = await User.findOne({email})
        if(userExist) return res.status(400).json({ msg: "Email is already exists" })
        
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        let user = new User({email , name, password: hash})
        await user.save()
        res.json({ msg: "User Saved successfully" })
        
    } catch (error) {
        res.status(400).json({ error, msg:"User Creation failed" })
    }
    // let user = new User({email , name, password})
    // user.password = hash
})

router.post('/login', async (req, res)=>{
    let {email, password} = req.body
    try {
        let user = await User.findOne({email})
        if(!user) return res.status(401).json({ msg: "cannot find user in db" })
        
        let result = await bcrypt.compare(password, user.password)
        if(!result) return res.status(400).json({ msg: "password not matched" })
        
        let payload = {userId : user._id}
        let token = jwt.sign(payload, process.env.jwtSecretKey , { expiresIn: '18h' })
        user.token = user.token.concat(token)
        await user.save()            
        res.json({token, user})        

    } catch (error) {
        res.status(400).json({ error, msg:"User LogIn failed" })
    }
})

router.get('/me', auth, (req,res)=> res.send(req.user))

router.get('/:id', auth, (req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((error,posts)=>{
            if(error) return res.status(400).json({error})
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/update-img', auth, upload.single("img"), (req,res)=>{
    User.findByIdAndUpdate(req.user._id, {$set: { img : req.file.filename }},
        { new:true },
        (err,result)=>{
         if(err) return res.status(400).json({error: err, msg : "img not saved"})
         res.json({img : req.file.filename, result})
    })
})

router.put('/follow', auth, (req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{$push:{followers:req.user._id}},{ new:true },(err,result)=>{
        if(err){
            return res.status(400).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password")
      .then(() =>{
        res.json({ msg: "follow action saved successfully" })
      }).catch(err=>{
          return res.status(400).json({error:err})
      })
    }
    )
})

router.put('/unfollow', auth, (req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(400).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password")
      .then(() =>{
        res.json({ msg: "unfollow action saved successfully" })
      }).catch(err=>{
          return res.status(400).json({error:err})
      })
    }
    )
})

router.put('/update-password', auth, async (req,res) => {
    let { oldPass, newPass } = req.body

    try {
        const user = await User.findOne({"_id": req.user._id})
        if(!user) return res.status(401).json({ msg: "cannot find user in db" })

        let result = await bcrypt.compare(oldPass, user.password)
        if(!result) return res.status(400).json({msg: "password not matched"})
        
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPass, salt)
        user.password = hash
        await user.save()
        res.json({ msg: "User password saved successfully" })    
        
    } catch (error) {
        res.status(400).json({ error, msg: "User password update failed" })
    }
})

router.post('/reset-password',(req,res)=>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err) return console.log(err)
        const reset_token = buffer.toString("hex")
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user) return res.status(422).json({error:"User dont exists with that email"})
            user.resetPassToken = reset_token
            user.expirePassToken = Date.now() + 3600000
            user.save().then((result)=>{
                transporter.sendMail({
                    to : user.email,
                    from : process.env.EMAIL,
                    subject : "password reset",
                    html : `
                    <p>You requested for password reset</p>
                    <h5>copy the following token to reset the password</h5>
                    <br />
                    <h2>${reset_token}</h2>
                    <br /> `
                }, (err, info)=>{
                    if (err) return console.log(err)
                    console.log("email send " + info.response)
                })
                res.json({message:"check your email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
   const newPassword = req.body.password
   const sentToken = req.body.token
   User.findOne({resetPassToken:sentToken,expirePassToken:{$gt:Date.now()}})
   .then(user=>{
       if(!user) return res.status(422).json({error:"Try again session expired"})
       bcrypt.hash(newPassword,10).then(hashedpassword=>{
          user.password = hashedpassword
          user.resePasstToken = undefined
          user.expirePassToken = undefined
          user.save()
          .then((saveduser)=>{
              res.json({msg : "password updated success"})
          })
       })
   }).catch(err=>{
       console.log(err)
   })
})

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })
})

router.post("/logout", auth, async (req, res)=>{
    let {user, token} = req
    
    try {
        user.token =  user.token.filter(t => t!=token)
        await user.save()
        res.json({ msg: "User logged out successfully" })
    } catch (error) {
        res.status(400).json({ error, msg:"User log out failed" })
    }
    //it worked without finding the user so try it for timing in future
})

router.delete("/", auth, async (req, res)=>{
    let user = req.user
    
    try {
        await User.findByIdAndRemove(user._id)
        res.send("User delete successfully")
    } catch (error) {
        res.status(400).json({ error, msg:"User deletion failed" })
    }
})

module.exports = router