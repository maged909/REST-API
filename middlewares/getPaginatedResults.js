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

module.exports = paginatedResults