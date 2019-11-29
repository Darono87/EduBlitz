const express = require("express");
const mediaModel = require("../models/Media");
const {uploader} = require("../middleware/uploader");
const verify = require("../middleware/verify");

var router = express.router();

/* Used to upload audios and images to the server. Does not accept any other files */

router.post("/file/upload", verify, uploader, async (req,res)=>{
    try{

        var newFile = new mediaModel;
        var data = JSON.parse(req.body.data);

        //Save Path & Requester

        newFile.Path = file.pathToSave;
        newFile.Owner = req.requester._id;
        
        //UsedIn is empty for now
        //...
        //Shared & Media Type

        newFile.Shared = data.Shared;
        newFile.MediaType = file.fileType;

        await newFile.save();

        res.status(201).send();

    }catch(e){

        res.status(500).send();

    }

});

module.exports = router;