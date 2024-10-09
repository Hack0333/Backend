const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/miniProject');

const userSchema = new mongoose.Schema({
   name : {
    type:String,
    require : true,
   },
   username : {
    type : String,
    require : true
   },
   email : {
    type : String,
    require : true,
    unique : true
   },
   password : {
    type : String,
    require : true
   },
   posts : [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Post'
   }]

})

const User = mongoose.model('User',userSchema);

module.exports = User;