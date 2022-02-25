// const { findById } = require("../models/user");


function getOne(model,param="id"){
    return async (req,res,next)=>{
        let modelResult
        try {
            const reqParam = eval("req.body."+param)
            modelResult = await model.findOne({[param]:reqParam}).exec();
            if(modelResult == null){
                return res.status(404).json({message:"Can't find user"})
            } 
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
        res.modelResult = modelResult
        next()
    }
}

module.exports = getOne