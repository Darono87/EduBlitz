//User model

const mongoose = require("mongoose");

var user = new mongoose.Schema({
    Nickname: {
        type: String,
        validate(val){

        },
        trim: true,
        required: true,
        unique: true
    },
    Password: { //Hashed with salt multiple times
        type: String,
        required: true
    },
    Tokens: [String],
    Settings: {type: [mongoose.Types.ObjectID], default: []} //settings set up by the user
},{
    timestamps:{
        createdAt: "Created",
        updatedAt: "Updated"
    }
});

var userModel = mongoose.model("User",user);

module.exports = userModel;