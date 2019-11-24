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
        default: undefined
    },
    FeelCheck: {type: Boolean, default: false},
    Owner: { //Owner of the card, user
        type: mongoose.Types.ObjectId,
        required: true
    }
},{
    timestamps: {
        createdAt: "Created",
        updatedAt: "Updated"
    }   
});

TWSCCard.methods.validateLinking = function(){

    var imgCount = 0;
    var txtCount = 0;
    var audCount = 0;

    for(var i = 0; i < this.LinkingFront.length; i++){
        if(this.LinkingFront[i] === "txt")
            txtCount++;
        if(this.LinkingFront[i] === "img")
            imgCount++;
        if(this.LinkingFront[i] === "aud")
            audCount++;
    }

    if( txtCount != this.TextsFront.length || imgCount != this.ImagesFront.length || audCount != this.AudioFront.length )
        throw new Error("baddata");

    imgCount = 0;
    txtCount = 0;
    audCount = 0;

    for(var i = 0; i < this.LinkingBack.length; i++){
        if(this.LinkingBack[i] === "txt")
            txtCount++;
        if(this.LinkingBack[i] === "img")
            imgCount++;
        if(this.LinkingBack[i] === "aud")
            audCount++;
    }

    if( txtCount != this.TextsBack.length || imgCount != this.ImagesBack.length || audCount != this.AudioBack.length )
        throw new Error("baddata");

}

const TWSCCardModel = mongoose.model("TWSCCard",TWSCCard);

module.exports = TWSCCardModel;