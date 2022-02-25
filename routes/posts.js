const express = require('express')
const router = express.Router();
const Post = require('../models/post')
const paginatedResults = require('../middlewares/getPaginatedResults')
const getOne = require('../middlewares/getOne')

router.get('/',paginatedResults(Post), async(req,res)=>{
    // res.send('Request has been sent');
    try{
        res.json(res.paginatedResults)
    }catch (err) {
        res.status(500).json({message:err.message})
    }
});
router.get('/:id',getOne(Post), (req,res)=>{
    res.json(res.modelResult)
});
router.post('/',async(req,res)=>{
    const post = new Post({
        title:req.body.title,
        body:req.body.body
    })
    try {
        const newPost = await post.save();
        res.status(201).json(newPost)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
});
router.patch('/:id',getOne(Post),async (req,res)=>{
    if(req.body.title != null){
        res.modelResult.title = req.body.title
    }
    if(req.body.body != null){
        res.modelResult.body = req.body.body
    }
    try {
        const updatedPost = await res.modelResult.save()
        res.json(updatedPost)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});
router.delete('/:id',getOne(Post),async (req,res)=>{
    try {
        await res.modelResult.remove();
        res.json({message:"Post Deleted"})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
});

module.exports = router