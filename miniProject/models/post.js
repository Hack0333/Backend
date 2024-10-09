const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title : {
        type : String,
        require : true
    },
   content :{
    type : String,
    require : true
   },
   author : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    require : true
   },
   likes : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : "User"
   },]
},{timestamps:true})

const Post = mongoose.model('Post',postSchema);

module.exports = Post;