const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/practice')
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log("MongoDB connection error:", err));

const userSchema = mongoose.Schema({
    Name : String,
    Email : String,
    Image : String
})


module.exports = mongoose.model('user',userSchema);