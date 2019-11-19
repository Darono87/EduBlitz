const jwt = require("jsonwebtoken")
const userM = require("../models/User");


var verify = async function (req,res,next){

    try{

        var token = req.header("Authorization").replace("Bearer ","");
        var exp = false;
        if(req.path === "/logout")
            exp = true;
        
        const decoded = jwt.verify(token,process.env.SECRET,{ignoreExpiration: exp});
        req.requester = await userM.findOne({"_id":decoded._id,"Tokens":token});
        if(!req.requester)
            throw new Error();
        req.token = token;
        next();

    }catch(e){
        res.status("401").send();
    }

};

module.exports = verify;