//User model

const mongoose = require("mongoose");

var user = new mongoose.Schema({
    Nickname: {
        type: String,
        validate(val){

        },
        trim: true,
        required: true
    },
    Password: { //Hashed with salt multiple times
        type: String,
        required: true
    },
    Salt: {
        type: String,
        required: true
    },
    Tokens: [String],
    Settings: [mongoose.Types.ObjectID] //settings set up by the user
},{
    createdAt: "Created",
    updatedAt: "Updated"
});

var userModel = mongoose.Model(user);

module.exports = userModel;