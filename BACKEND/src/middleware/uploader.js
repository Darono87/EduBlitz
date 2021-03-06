const multer = require("multer");
const { generateFileName } = require("../utils/Generators");
const fs = require("fs");

const audioExtensions = ["wav", "mp3", "ogg"];
const imgExtensions = ["png", "jpg", "jpeg"];


function quickValidate(req, file, cb) {
    var extension = file.originalname.split(".")[1];
    if (audioExtensions.some((v) => v === extension)){
        var path = "./public/uploads/" + req.requester._id + "/audio";
        var type = "AUD";
    }
    else if (imgExtensions.some((v) => v === extension)){
        var path = "./public/uploads/" + req.requester._id + "/images";
        var type = "IMG";
    }
    else{
        cb(null, false, new Error("extension"));
        return;
    }

    file.pathToSave = path;
    file.fileType = type;

    cb(null, true);
}

const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        var path = file.pathToSave;
        
        if (!fs.existsSync("./public/uploads/" + req.requester._id))
            fs.mkdirSync("./public/uploads/" + req.requester._id);
        if(!fs.existsSync(path))
            fs.mkdirSync(path);

        cb(null, path);

    },
    filename: function (req, file, cb) {
        file.nickname = generateFileName(file.originalname);
        cb(null, file.nickname);
    }

});

const uploader = multer({
    storage,
    limits: {
        fileSize: 3000000,
        fields: 1,
        fieldNameSize: 15
    },
    fileFilter: quickValidate
});

module.exports = { storage, uploader };