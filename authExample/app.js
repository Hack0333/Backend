const express = require('express');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const userModel = require('./mongodb/user');

const app = express();
app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render("index");
});

app.post('/create', async (req, res) => {
    const { username, email, password, age } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createdUser = await userModel.create({
            username,
            email,
            password: hashedPassword,
            age,
        });

        const token = jwt.sign(hashedPassword,"Deepak");
        res.cookie('token',token);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});

// app.get('/user',async(req,res)=>{
//     const users = await userModel.find();      
//     res.render('user',{users});
// })

app.get('/logout',(req,res)=>{
    res.clearCookie('token');
    res.send('You have been logout');
})

app.get('/login',(req,res)=>{
    res.render('login');
})

app.post('/login/user',async(req,res)=>{
    const {password , email} = req.body;
    const user = await userModel.findOne({email});
    bcrypt.compare(password , user.password,(err,result)=>{
        if(result){
            const token = jwt.sign(hashedPassword,"Deepak");
            res.cookie('token',token);
            return res.send("u can login");
        }else{
            return res.send("Invalid credential");
        }
    });

})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
