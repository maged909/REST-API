require("dotenv").config()

const jwt = require('jsonwebtoken')




function authenticateToken(){
    return (req,res,next)=>{
        const authHeader = req.headers['authorization']
        const token =  authHeader.split(' ')[1]
        // console.log(typeof token)
        if(token == '') return res.sendStatus(401)
        try {
            jwt.verify(token.toString(), process.env.ACCESS_TOKEN_SECRET, (err,model)=>{
            if(err) return res.sendStatus(403);
            res.model=model
            next()
        })
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = authenticateToken