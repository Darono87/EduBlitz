//User router - login, logout, register

const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verify = require("../middleware/verify");

var router = express.Router();

function isGoodPassword(pass) { // _ - okay + alphanumeric. Do not start with 0-9
    var code, i, len;
  
    if (pass.length < 8 || pass.length > 30)
        return false;

    if(pass.charCodeAt(0) >= 48 && pass.charCodeAt(0) <= 57)
        return false;

    for (i = 0, len = pass.length; i < len; i++) {
      code = pass.charCodeAt(i);
      if ((code < 48 || code > 57) && // numeric (0-9)
          (code < 65 || code > 90) && // upper alpha (A-Z)
          (code < 97 || code > 122) && // lower alpha (a-z)
          code != 95 && code != 45) // _ -
        return false;
    }

    return true;
  };

router.post("/register", async (req,res)=>{
    try{

        if(req.body.Nickname.len > 30){
            throw Error("credentials");
        }

        var newUser = new userModel;
        newUser.Nickname = req.body.Nickname;
        var pass = req.body.Password;

        if(!isGoodPassword(pass)){
            throw Error("credentials");
        }

        var salt = await bcrypt.genSalt(13);
        var passHashed = await bcrypt.hash(pass, salt);
        newUser.Password = passHashed;

        var _id = mongoose.Types.ObjectId();
        newUser._id = _id;

        var token = jwt.sign({_id},process.env.SECRET,{expiresIn: "1h"});
        newUser.Tokens.push(token);

        await newUser.save();

        res.status("201").send(newUser);

    }catch(e){
        if(e.errors || e.message == "credentials"){
            res.status("400").send();
        }
        else{
            res.status("500").send();
        }
    }
});

router.post("/login", async (req, res)=>{

    try{

        //We are given user's nickname and password

        var u = await userModel.findOne({Nickname: req.body.Nickname});

        if(!u)
            throw new Error("nouser");
        
        var fine = await bcrypt.compare(req.body.Password,u.Password);

        if(!fine)
            throw new Error("nouser");

        //Everything is fine, proceed 

        var token = jwt.sign({_id: u._id},process.env.SECRET,{expiresIn: "1h"});
        u.Tokens.push(token);

        await u.save();

        res.send({user: u, token});


    }catch(e){
        if(e.message == "nouser")
            res.status("404").send();
        else
            res.status("500").send();
    }

});

router.post("/logout", verify, async(req,res)=>{
    try{

        var index = 0;
        for(var i = 0; i < req.requester.Tokens.length; i++)
            if(req.requester.Tokens[i]==req.token){
                index = i;
                break;
            }
        
        req.requester.Tokens.splice(index,1);
        await req.requester.save();

        res.send();
   
    }catch(e){
        res.status(500).send();
    }

});


module.exports = router;