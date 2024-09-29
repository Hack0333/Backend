const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/dataAss");

const userSchema = mongoose.Schema({
    username : {
        type : String,
        require : true,
        // unique : true
    },
    email : {
        type : String,
        require : true,
        // unique : true
    },
    age : {
        type : Number,
        require : true,
    },
    posts : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'post'
        }
    ]
});

module.exports = mongoose.model("user", userSchema);