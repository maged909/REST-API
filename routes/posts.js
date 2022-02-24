const express = require('express')
const router = express.Router();
const Post = require('../models/post')

router.get('/',paginatedResults(Post), async(req,res)=>{
    // res.send('Request has been sent');
    try{
        res.json(res.paginatedResults)
    }catch (err) {
        res.status(500).json({message:err.message})
    }
});
router.get('/:id',getPost, (req,res)=>{
    res.json(res.post)
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
router.patch('/:id',getPost,async (req,res)=>{
    if(req.body.title != null){
        res.post.title = req.body.title
    }
    if(req.body.body != null){
        res.post.body = req.body.body
    }
    try {
        const updatedPost = await res.post.save()
        res.json(updatedPost)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
});
router.delete('/:id',getPost,async (req,res)=>{
    try {
        await res.post.remove();
        res.json({message:"Post Deleted"})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
});

async function getPost(req,res,next){
    let post
    try {
        post = await Post.findById(req.params.id)
        if(post == null){
            return res.status(404).json({message:"Can't find post"})
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
    res.post = post
    next()
}
function paginatedResults(model){
    return async(req,res,next)=>{
        const modelResults = await model.find()

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const startIndex = (page - 1)*limit
        const endIndex = page*limit
        const results={}
        if(startIndex>0){
            results.previous = {
            page:page-1,
            limit:limit
            }
        }
        if(endIndex<modelResults.length){
            results.next = {
            page:page+1,
            limit:limit
            }
        }
        

        results.results = modelResults.slice(startIndex,endIndex)
        res.paginatedResults=results
        next()
    }
}

module.exports= router