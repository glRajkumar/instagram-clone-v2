const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const Post =  require("../models/Post")

router.get('/mypost', auth, (req,res)=>{
    Post.find({postedBy:req.user._id})
    .populate("PostedBy","_id name")
    .then(mypost=>{
        res.json({ mypost })
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
        res.json({ posts })
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
        res.json({ posts })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.post('/createpost', auth, (req,res)=>{
    const { title, body, picUrl } = req.body
    const id = req.user._id
    
    const post = new Post({
        title,
        body,
        photo : picUrl,
        postedBy : id
    })
    
    post.save()
    .then(()=>{
        res.json({ msg: "Post saved successfully" })
    })
    .catch(err=>{
        console.log(err)
    })
})

router.put('/hearted', auth, async (req,res)=>{
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, {$push : { hearted : id }})
        res.json({ msg : 'hearted successfully' })
        
    } catch (error) {
        res.status(400).json({ error, msg : 'hearted action failed' })
    }
})

router.put('/unhearted', auth, async (req,res)=>{
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, {$pull : { hearted : id }})
        res.json({ msg : 'unhearted successfully' })
        
    } catch (error) {
        res.status(400).json({ error, msg : 'unhearted action failed' })
    }
})

router.put('/like', auth, async (req,res)=>{
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, {$push : { likes : id }})
        res.json({ msg : 'liked successfully' })
        
    } catch (error) {
        res.status(400).json({ error, msg : 'like action failed' })
    }
})

router.put('/unlike', auth, async (req,res)=>{
    const id = req.user._id
    const { postId } = req.body

    try {
        await Post.findByIdAndUpdate(postId, {$pull : { likes : id }})
        res.json({ msg : 'unliked successfully' })
        
    } catch (error) {
        res.status(400).json({ error, msg : 'unliked action failed' })
    }
})

router.put('/comment', auth, (req,res)=>{
    const { postId } = req.body
    const comment = {
        text : req.body.text,
        postedBy : req.user._id
    }
    
    Post.findByIdAndUpdate(postId, {$push: { comments : comment }},{ new : true })
    .populate("comments.postedBy","_id name img")
    .populate("postedBy","_id name img")
    .exec((err,result)=>{
        if(err) return res.status(422).json({error:err})
        res.json(result)
    })
})

router.delete('/:postId', auth, async (req,res)=>{
    const id = req.params.postId

    try {
        await Post.findByIdAndRemove(id)
        res.json({ msg:"deleted successfully" })  
        
    } catch (error) {
        res.status(400).json({ error, msg : 'delete action failed' })
    }
})

module.exports = router