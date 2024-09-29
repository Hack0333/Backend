const mongoose = require('mongoose');

// mongoose.connect("mongodb://localhost:27017/dataAss");

const postSchema = mongoose.Schema({
    postData :{
        type : String,
        require : true,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
});

module.exports= mongoose.model("post", postSchema);