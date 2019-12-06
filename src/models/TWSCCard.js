//Two way single content card

const mongoose = require("mongoose");
const mediaModel = require("./Media");

const TWSCCard = new mongoose.Schema({
    Name: {
        type: String,
        lowercase: true,
        trim: true,
        unique: true,
        default: "AN=" + Date.now()
    },
    Description: {
        type: String
    },
    TextsFront: { type: [String], required: true }, //texts array
    ImagesFront: { type: [{ type: mongoose.Types.ObjectId, ref: "Media" }], required: true }, //link to images content
    AudioFront: { type: [{ type: mongoose.Types.ObjectId, ref: "Media" }], required: true }, // link to audio content
    LinkingFront: { type: [String], required: true }, // ["txt","txt","img","aud","txt","img"] Taken from the upper parts
    TextsBack: { type: [String], required: true },
    ImagesBack: { type: [{ type: mongoose.Types.ObjectId, ref: "Media" }], required: true },
    AudioBack: { type: [{ type: mongoose.Types.ObjectId, ref: "Media" }], required: true },
    LinkingBack: { type: [String], required: true }, //same but for the second part of the card
    Extras: {
        type: String //Displayed at the bottom, additional information needed to satisfy the conditions of the task
    },
    Tags: [{ type: String, lowercase: true, trim: true }],
    TypeOfCheck: { //link to the types of checking the answer appropriate to the user's demands
        type: mongoose.Types.ObjectId,
        default: undefined
    },
    FeelCheck: { type: Boolean, default: false },
    Owner: { //Owner of the card, user
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    timestamps: {
        createdAt: "Created",
        updatedAt: "Updated"
    }
});

var _checkIfMediaIsUnconnected = async function (mediaID, type) {

    if (type === "img")
        var somewhereElse = await TWSCCardModel.findOne({ $or: [{ ImagesFront: mediaID }, { ImagesBack: mediaID }] });
    else
        var somewhereElse = await TWSCCardModel.findOne({ $or: [{ AudioFront: mediaID }, { AudioBack: mediaID }] });

    if (!somewhereElse) {
        var medium = await mediaModel.findOne({ _id: mediaID });
        medium.UsedIn = false;
        await medium.save();
        return true;
    }
    return false;
}

TWSCCard.statics.detectUnconnectedMedia = async function (deletedCard) {
    var unconnectedPhotos = [];
    var unconnectedAudios = [];
    for (var i = 0; i < deletedCard.ImagesFront.length; i++)
        if (await _checkIfMediaIsUnconnected(deletedCard.ImagesFront[i], "img"))
            unconnectedPhotos.push(deletedCard.ImagesFront[i]);
    for (var i = 0; i < deletedCard.ImagesBack.length; i++)
        if (await _checkIfMediaIsUnconnected(deletedCard.ImagesBack[i], "img"))
            unconnectedPhotos.push(deletedCard.ImagesBack[i]);
    for (var i = 0; i < deletedCard.AudioFront.length; i++)
        if (await _checkIfMediaIsUnconnected(deletedCard.AudioFront[i], "aud"))
            unconnectedPhotos.push(deletedCard.AudioFront[i]);
    for (var i = 0; i < deletedCard.AudioBack.length; i++)
        if (await _checkIfMediaIsUnconnected(deletedCard.AudioBack[i], "aud"))
            unconnectedPhotos.push(deletedCard.AudioBack[i]);

    return { unconnectedPhotos, unconnectedAudios };
}

TWSCCard.methods.validateLinking = async function (requester) {

    //relatively faster operation to check 

    var imgCount = 0;
    var txtCount = 0;
    var audCount = 0;
    var imgFound = await mediaModel.find({ _id: { $in: this.ImagesFront }, Owner: requester._id });
    var audFound = await mediaModel.find({ _id: { $in: this.AudioFront }, Owner: requester._id });

    for (var i = 0; i < this.LinkingFront.length; i++) {
        if (this.LinkingFront[i] === "txt")
            txtCount++;
        if (this.LinkingFront[i] === "img")
            imgCount++;
        if (this.LinkingFront[i] === "aud")
            audCount++;
    }
    if (txtCount != this.TextsFront.length || imgCount != imgFound.length || audCount != audFound.length)
        throw new Error("baddata");




    imgCount = 0;
    txtCount = 0;
    audCount = 0;
    var imgFoundB = await mediaModel.find({ _id: { $in: this.ImagesBack }, Owner: requester._id });
    var audFoundB = await mediaModel.find({ _id: { $in: this.AudioBack }, Owner: requester._id });

    for (var i = 0; i < this.LinkingBack.length; i++) {
        if (this.LinkingBack[i] === "txt")
            txtCount++;
        if (this.LinkingBack[i] === "img")
            imgCount++;
        if (this.LinkingBack[i] === "aud")
            audCount++;
    }

    if (txtCount != this.TextsBack.length || imgCount != imgFoundB.length || audCount != audFoundB.length)
        throw new Error("baddata");

    var mediaData = [imgFound, audFound, imgFoundB, audFoundB];
    return mediaData;

}

const TWSCCardModel = mongoose.model("TWSCCard", TWSCCard);

module.exports = TWSCCardModel;