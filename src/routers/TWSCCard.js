
//CRUD Operations defined for TWSC Card: Create, Read, Update, Delete

const express = require("express");
const TWSCCardModel = require("../models/TWSCCard");

var router = express.Router();

//CREATE

router.post("/card",(req,res)=>{

    res.send();

});

module.exports = router;