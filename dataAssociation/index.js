const express = require('express');
const userModel = require('./models/user.js');
const postModel = require('./models/post.js');

const app = express();

app.get("/",(req,res)=>{
    res.send("Done");
})

// app.get('/create',async(req,res)=>{
//     // const user = await userModel.create({
//     //     username : "Rohan",
//     //     email : "Rohan@gmail.com",
//     //     age : 23
//     // })
//     // res.send("created user");
//     // const allUser = await userModel.find();
//     // res.send(allUser);
// })
app.get('/create/post',async(req,res)=>{
    const post = await postModel.create({
        post : "This is just for testing",
        user : "66f8d6e60cfbc122432d67d8"
    });
    const user = await userModel.findOne({_id : "66f8d6e60cfbc122432d67d8"});
    user.posts.push(post._id);
    await user.save();
    const allUser = await userModel.find();
    res.send(allUser);
    
    // res.send(user);
})

app.listen(3000);