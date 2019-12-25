const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
const userR = require("./src/routers/User");
const mediaR = require("./src/routers/Media");
const TWSCCardR = require("./src/routers/TWSCCard");
require('dotenv').config();

var app = express();
var staticPath = path.join(__dirname,"./public");
var viewsPath = path.join(__dirname,"./views");
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false});

app.set("view engine","hbs");
app.set("views",viewsPath);
app.use(express.json());
app.use(express.static(staticPath));
app.use(userR);
app.use(mediaR);
app.use(TWSCCardR);
hbs.registerPartials(viewsPath);

app.get("/",(req,res)=>{
    res.render("test/prototype1");
})

app.listen(process.env.PORT);