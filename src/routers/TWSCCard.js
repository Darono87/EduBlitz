
//CRUD Operations defined for TWSC Card: Create, Read, Update, Delete

const express = require("express");
const TWSCCardModel = require("../models/TWSCCard");
const verify = require("../middleware/verify");


var router = express.Router();

//CREATE

router.post("/card",verify, async (req,res)=>{

    try{

        var newCard = new TWSCCardModel;

        //set Name and desription

        if(req.body.Name)
            newCard.Name = req.body.Name;

        newCard.Description = req.body.Description;

        //Front tabs

        newCard.ImagesFront = req.body.ImagesFront;
        newCard.AudioFront = req.body.AudioFront;
        newCard.TextsFront = req.body.TextsFront;
        newCard.LinkingFront = req.body.LinkingFront;

        
        //Back data

        newCard.ImagesBack = req.body.ImagesBack;
        newCard.AudioBack = req.body.AudioBack;
        newCard.TextsBack = req.body.TextsBack;
        newCard.LinkingBack = req.body.LinkingBack;

        //validate
        
        var imgData = await newCard.validateLinking(req.requester);
        await newCard.linkMediaToCard(imgData);
        
        //Extras and tags

        newCard.Extras = req.body.Extras;
        newCard.Tags = req.body.Tags;

        //TypeOfCheck
        //now assume checkMethod field was set to "feel"

        if(!req.body.CheckMethod)
            throw new Error("baddata");

        newCard.FeelCheck = true;
        
        //Owner

        newCard.Owner = req.requester._id;
        
        await newCard.save();
        res.status(201).send(newCard);

    }catch(e){

        if(e.errors || e.message == "baddata" || e.name == "MongoError"){
            console.log(e);
            res.status("400").send();
        } else{
            console.log(e);
            res.status("500").send();
        }

    }
});

router.delete("/card/:id",verify, async (req,res)=>{

    try{

        var toDelete = req.params.id;
        var foundItem = await TWSCCardModel.findOneAndRemove({_id: toDelete, Owner: req.requester._id});
        if(!foundItem)
            res.status(404).send();

        res.status(200).send(foundItem);

    }catch(e){
        res.status(404).send();
    }
    

});

router.get("/card/all",verify,async(req,res)=>{

    try{
        
        var foundItems = await TWSCCardModel.find({Owner: req.requester._id})
        .populate({path:"ImagesFront",select:"Path"})
        .populate({path:"ImagesBack",select:"Path"})
        .populate({path:"AudioFront",select:"Path"})
        .populate({path:"AudioBack",select:"Path"}).exec();
        res.status(200).send(foundItems);

    }catch(e){
        res.status(500).send();
    }

});

router.get("/card/:id", verify, async(req,res)=>{

    try{

        var toGet = req.params.id;
        var foundItem = await TWSCCardModel.findOne({_id: toGet, Owner: req.requester._id})
        .populate({path:"ImagesFront",select:"Path"})
        .populate({path:"ImagesBack",select:"Path"})
        .populate({path:"AudioFront",select:"Path"})
        .populate({path:"AudioBack",select:"Path"}).exec();
        if(!foundItem)
            res.status(404).send();

        res.status(200).send(foundItem);

    }catch(e){
        res.status(404).send();
    }

});

router.patch("/card/:id", verify, async(req,res)=>{

    

});

module.exports = router;