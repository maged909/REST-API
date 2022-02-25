const getOne = require('./getOne')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JsonWebTokenError } = require('jsonwebtoken');

function authorization(model){
    return async (req,res,next)=>{
        let authorized
        try {
            user = await res.modelResult;
            console.log(user)
            if(await bcrypt.compare(req.body.password,user.password)){
                authorized=true
            }else{
                authorized=false
            }
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
        res.authorized = authorized
        next()
    }
}

module.exports = authorization