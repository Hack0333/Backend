const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser());

// Setting and reading the cookies
// app.get('/',(req,res)=>{
//    res.cookie("name" , "Deepak Kumar Sharma");
//    console.log(req.cookies);
//    res.send("Done");
// })

// Bcrpty encryption and decryption
// app.get('/',(req,res)=>{
//     bcrypt.genSalt(10,function(err,salt){
//         bcrypt.hash("Deepak1234",salt,(err,hash)=>{
//             // console.log("salt = ",salt);
//             // console.log("hash = ",hash);
//             res.cookie("hash",hash);
//             // console.log(req.cookies.hash);
//             res.send("Done")
//         })
//     })
//     // res.send("error")
// });

// app.get('/',(req,res)=>{
//     bcrypt.compare("Deepak1234","$2b$10$oKSAPXp7uJINznhT.OnVfOPWznNyKEQDdfaALd//EWtCxNv7P/zSS",(err,result)=>{
//         if(result){
//             console.log("mashbsfcu");
            
//         }else{
//             console.log("Not Matched");
//         }
//     });
//     res.send("done")
// })

// JWT TOKEN
// app.get('/',(req,res)=>{
//     let token = jwt.sign({email : "Deepak@.com"},"secret");
//     res.cookie("token",token);
//     res.send("JWT");
// })
app.get('/',(req,res)=>{
    let data = jwt.verify(req.cookies.token,"secret");
    // console.log("token = ",token);
    console.log("data = ",data);
})



app.listen(3000);

