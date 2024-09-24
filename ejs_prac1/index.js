const express = require('express');
const path = require('path');
const userModel = require('./models/user.js');

const app = express();
app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));



app.get('/',(req,res)=>{
    res.render("index");
})
app.get('/read',async(req,res)=>{
    const users = await userModel.find();      
    res.render('read',{users});
})
app.get('/delete/:id',async(req,res)=>{
    const users = await userModel.findOneAndDelete({_id : req.params.id}); 
    res.redirect('/read');
})
app.post('/create',async(req,res)=>{
    try {
        const { name, email, image } = req.body;
        const createdUser = await userModel.create({
            Name: name,
            Email: email,
            Image: image
        });
        // console.log(req.body);
        res.redirect('/read');
    } catch (error) {
        console.log("Error creating user:", error);
        res.status(500).send({ error: "Failed to create user" });
    }
})

app.listen(3000,()=>console.log("server running at http://localhost:3000"));