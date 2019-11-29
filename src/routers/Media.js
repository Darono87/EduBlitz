const express = require("express");
const mediaModel = require("../models/Media");
const { uploader } = require("../middleware/uploader");
const verify = require("../middleware/verify");

var router = express.Router();

/* Used to upload audios and images to the server. Does not accept any other files */

router.post("/file/upload", verify, uploader.single("media"), async (req, res) => {
    try {

        var newFile = new mediaModel;
        var data = JSON.parse(req.body.data);

        //Save Path & Requester

        newFile.Path = req.file.pathToSave + "/" + req.file.nickname;
        newFile.Owner = req.requester._id;

        //UsedIn is empty for now
        //...
        //Shared & Media Type

        newFile.Shared = data.Shared ? data.Shared : [];
        newFile.MediaType = req.file.fileType;

        await newFile.save();

        res.status(201).send(newFile);

    } catch (e) {
        res.status(500).send();

    }

});

module.exports = router;