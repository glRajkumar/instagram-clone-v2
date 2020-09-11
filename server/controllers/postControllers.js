const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const auth = require('../middlewares/auth')
const Post =  require("../models/Post")

router.get('/mypost', auth, (req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.get('/allpost', auth, (req,res)=>{
    Post.find()
    .populate("postedBy","_id name img")
    .populate("comments.postedBy","_id name img")
    .sort('-createdAt')
    .then((posts)=>{
        res.json({posts})
    }).catch(err=>{
        console.log(err)
    })
})

router.get('/getsubpost', auth, (req,res)=>{
    Post.find({ postedBy: {$in : req.user.following} })
    .populate("postedBy","_id name img")
    .populate("comments.postedBy","_id name img")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost', auth, (req,res)=>{
    const {title,body,picUrl} = req.body 
    if(!title || !body || !picUrl){
      return  res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body,
        photo:picUrl,
        postedBy:req.user._id
    })
    post.save()
    .then(()=>{
        res.json({ msg: "Post saved successfully" })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/hearted', auth, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{hearted:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)return res.status(422).json({error:err})
        res.json(result)
    })
})

router.put('/unhearted', auth, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{hearted:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)return res.status(422).json({error:err})
        res.json(result)
    })
})

router.put('/like', auth, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)return res.status(422).json({error:err})
        res.json(result)
    })
})

router.put('/unlike', auth, (req,res)=>{
    Post.findByIdAndUpdate(req.body.postId,{
        $pull:{likes:req.user._id}
    },{
        new:true
    }).exec((err,result)=>{
        if(err)return res.status(422).json({error:err})
        res.json(result)
    })
})

router.put('/comment', auth, (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id name img")
    .populate("postedBy","_id name img")
    .exec((err,result)=>{
        if(err) return res.status(422).json({error:err})
        res.json(result)
    })
})

router.delete('/:postId', auth, (req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        if(post.postedBy._id.toString() === req.user._id.toString()){
              post.remove()
              .then(result=>{
                //   res.json(result)
                res.json({_id: result._id, msg:"deleted successfully"})
              }).catch(err=>{
                  console.log(err)
              })
        }
    })
})

module.exports = router