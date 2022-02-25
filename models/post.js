const res = require('express/lib/response');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const postSchema = new mongoose.Schema({
    
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
},{timestamps:true});

postSchema.plugin(mongoosePaginate);

const post = mongoose.model('Post', postSchema);
module.exports=mongoose.model('Post',postSchema)