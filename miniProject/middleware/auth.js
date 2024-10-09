const jwt = require("jsonwebtoken");
const userModel = require("../models/user.js");

const isLoggedIn = async(req,res,next) =>{
    const token = req.cookies.token;
    if(token){
      const decoded = jwt.verify(token,"Deepak@123");
      const user = await userModel.findOne({_id:decoded.userid});
      if(!user){
        return res.status(404).json({message:"User not found"});
      }
      req.user = user;
      next();
    }else{
      res.redirect("/login");
    }
}

module.exports = {isLoggedIn};