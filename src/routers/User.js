//User router - login, logout, register

const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var router = express.Router();

function isGoodPassword(pass) { // _ - okay + alphanumeric. Do not start with 0-9
    var code, i, len;
  
    if (len < 8 || len > 30)
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

        var salt = await bcrypt.genSalt();
        var passHashed = await bcrypt.hash(pass, salt);
        newUser.Password = passHashed;
        newUser.Salt = salt;

        var _id = mongoose.Types.ObjectId();
        newUser._id = _id;

        var token = jwt.sign({_id},process.env.SECRET,{expiresIn: "1h"});
        newUser.Tokens.push(token);

        newUser.save();

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

module.exports = router;