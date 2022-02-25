require('dotenv').config();

const express = require('express')
const router = express.Router();
const Post = require('../models/post')
const User = require('../models/user')
const paginatedResults = require('../middlewares/getPaginatedResults')
const jwt = require('jsonwebtoken')
const { JsonWebTokenError } = require('jsonwebtoken');
// const authenticateToken = require('../middlewares/authenticateToken')
const getOne = require('../middlewares/getOne');
const { findById } = require('../models/user');

router.get('/',authenticateToken,paginatedResults(Post), async(req,res)=>{
    // res.send('Request has been sent');
    try{
        res.json({currentUser:res.user,page:res.paginatedResults})
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