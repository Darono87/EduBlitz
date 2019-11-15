//Two way single content card

const mongoose = require("mongoose");

const TWSCCard = new mongoose.Schema({
    Name:{
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        default: "AN="+Date.now()
    },
    Description:{
        type: String
    },
    TextsFront:{type: [String], required: true}, //texts array
    ImagesFront:{type: [mongoose.Types.ObjectId], required: true}, //link to images content
    AudioFront:{type: [mongoose.Types.ObjectId], required: true}, // link to audio content
    LinkingFront: {type: [String], required: true}, // ["txt","txt","img","aud","txt","img"] Taken from the upper parts
    TextsBack:{type: [String], required: true},
    ImagesBack:{type: [mongoose.Types.ObjectId], required: true},
    AudioBack:{type: [mongoose.Types.ObjectId], required: true},
    LinkingBack: {type: [String], required: true}, //same but for the second part of the card
    Extras: {
        type: String //Displayed at the bottom, additional information needed to satisfy the conditions of the task
    },
    Tags: [{type: String, lowercase: true, trim: true}],
    TypeOfCheck: { //link to the types of checking the answer appropriate to the user's demands
        type: mongoose.Types.ObjectId,
        required: true
    }
},{
    createdAt: "Created",
    updatedAt: "Updated"
});

const TWSCCardModel = mongoose.model("TWSCCard",TWSCCard);

module.exports = TWSCCardModel;