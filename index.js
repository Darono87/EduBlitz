const express = require("express");
const path = require("path");
const hbs = require("hbs");
const mongoose = require("mongoose");
require('dotenv').config();

var app = express();
var staticPath = path.join(__dirname,"./public");
var viewsPath = path.join(__dirname,"./views");
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true});

app.set("view engine","hbs");
app.set("views",viewsPath);
app.use(express.json());
app.use(express.static(staticPath));
hbs.registerPartials(viewsPath);

app.get("/",(req,res)=>{
    res.render("test/prototype1");
})

app.listen(process.env.PORT);