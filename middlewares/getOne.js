function getOne(model){
    return async (req,res,next)=>{
        // try {
        //     const modelResult = await model.findById(req.params.id).exec()
        //     if(modelResult == null){
        //         return res.status(404).json({message:"Can't find post"})
        //     }
        // } catch (err) {
        //     return res.status(500).json({message: err.message})
        // }
        // res.getOne = modelResult
        // next()

        let modelResult
        try {
            modelResult = await model.findById(req.params.id)
            if(modelResult == null){
                return res.status(404).json({message:"Can't find post"})
            }
        } catch (err) {
            return res.status(500).json({message: err.message})
        }
        res.modelResult = modelResult
        next()
    }
}

module.exports = getOne