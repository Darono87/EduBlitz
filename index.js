const express = require("express");
const path = require("path");
const hbs = require("hbs");
require('dotenv').config();

var app = express();
var staticPath = path.join(__dirname,"./public");
var viewsPath = path.join(__dirname,"./views");

app.set("view engine","hbs");
app.set("views",viewsPath);
app.use(express.json());
app.use(express.static(staticPath));
hbs.registerPartials(viewsPath);

app.get("/",(req,res)=>{
    res.render("test/prototype1");
})

app.listen(process.env.PORT);