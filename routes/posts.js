require('dotenv').config();
const express = require('express')
const router = express.Router();
const Post = require('../models/post')
const jwt = require('jsonwebtoken')
const { JsonWebTokenError } = require('jsonwebtoken');
const getOne = require('../middlewares/getOne');
const { findById } = require('../models/user');

// router.get('/',authenticateToken,(req,res)=>{
//     res.redirect('/1-2');
// })

router.get('/',authenticateToken, (req,res)=>{
    try {
        var page=req.params.page || 1;
        var limit=req.params.limit || 2;
        Post.paginate({}, {page:page,limit: limit,collation: {locale:'en'}}, function(error, pageCount, paginatedResults) {
            if (error) {
              console.error(error);
            } else {
              res.json({'currentUser':res.user,'Pages': pageCount});
            //   console.log(paginatedResults);
            }
        });
    } catch (err) {
        res.json({message:err.message})
    }
    // res.send('Request has been sent');
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
function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    // console.log(typeof token)
    if(token == '') return res.sendStatus(401)
    
    jwt.verify(token.toString(), process.env.ACCESS_TOKEN_SECRET, (err,user)=>{
        if(err) return res.sendStatus(403);
        res.user=user
        next()
    })
}


module.exports = router