const express = require("express");
const mediaModel = require("../models/Media");
const {uploader} = require("../middleware/uploader");
const verify = require("../middleware/verify");

var router = express.router();

/* Used to upload audios and images to the server. Does not accept any other files */

router.post("/file/upload", verify, uploader, (req,res)=>{
    res.send();
});

module.exports = router;