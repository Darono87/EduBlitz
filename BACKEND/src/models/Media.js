const mongoose = require("mongoose");

var allowedMediaTypes = ["IMG","AUD"];

var mediaSchema = new mongoose.Schema({
    Name: {

    },
    Path: {
        type: String,
        required: true,
        trim: true
    },
    UsedIn: {
        type: Boolean,
        default: false
    },
    Owner: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    Shared: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    MediaType: {
        type: String,
        required: true,
        validate(v){ 

            for(var i = 0; i < allowedMediaTypes.length; i++)
                if(v === allowedMediaTypes[i]){
                    return true;
                }
            return false; 

        }
    }

},{
    timestamps:{
        createdAt: "Created",
        updatedAt: "Updated"
    }
});

var mediaModel = mongoose.model("Media",mediaSchema);

module.exports = mediaModel;