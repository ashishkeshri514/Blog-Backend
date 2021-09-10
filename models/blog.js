const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
// title + author + content
const blogSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    content:{
        type:String,
        required:true
    },
    author:{
        type: ObjectId,
        ref:"User"
    }
})


blogSchema.index({ title: "text" });

mongoose.model("Blog",blogSchema).createIndexes();
