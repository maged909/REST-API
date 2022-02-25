const express = require('express')
const router = express.Router();
const User = require('../models/user')
const getPaginatedResults = require('../middlewares/getPaginatedResults')
const getOne = require('../middlewares/getOne')
const bcrypt = require('bcrypt')


router.get('/',getPaginatedResults(User),async (req,res)=>{
    try{
        res.json(res.paginatedResults)
    }catch (err) {
        res.status(500).json({message:err.message})
    }
})
router.post('/',async (req,res)=>{
    try {
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        console.log(hashedPassword)
        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:hashedPassword
        })
        await newUser.save();
        res.status(201).json(newUser)
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})
router.post('/login',async(req,res)=>{
    const user = await User.findOne({ email: req.body.email}).exec();
    if(user==null){
        return res.status(400).send("can't find user")
    }
    // return res.send(user);
    try {
        if(await bcrypt.compare(req.body.password,user.password)){
            res.send('Success')
        }else{
            res.send('Not allowed')
        }
    } catch (err) {
        res.status(400).json({message:err.message})
    }
})
router.get('/:id',getOne(User), (req,res)=>{
    res.json(res.modelResult)
});
router.patch('/:id',getOne(User),async (req,res)=>{
    if(req.body.name != null){
        res.modelResult.name = req.body.name
    }
    if(req.body.email != null){
        res.modelResult.email = req.body.email
    }
    if(req.body.password != null){
        res.modelResult.password = req.body.password
    }
    try {
        const updatedUser = await res.modelResult.save()
        res.json(updatedUser)
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})

router.delete('/:id',getOne(User),async (req,res)=>{
    try {
        await res.modelResult.remove();
        res.json({message:"User Deleted"})
    } catch (err) {
        res.status(500).json({message:err.message})
    }
});



module.exports = router