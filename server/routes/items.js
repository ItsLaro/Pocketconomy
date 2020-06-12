import express from "express";
import mongoose from "mongoose";
import Item from "../models/item.js";

const router = express.Router();

mongoose.connect("mongodb://localhost:27017/PocketonomyDB", { useUnifiedTopology: true, useNewUrlParser: true })

router.get("/db", function(req, res) {

    Item.find({}, "type description value")
        .exec()
        .then((items) => {
            res.send(items);    
        })
        .catch((err) => {
            console.log("Error: Failed to retrieve income data.")
        });
});

router.post("/db", function(req, res) {
    console.log(req.body);
    const newItem = new Item({
        _id: req.body.id,
        type: req.body.type,
        description: req.body.description,
        value: req.body.value
    });

    newItem.save(function(err){
        if(err){
            console.log("Error: Storing to DB Failed.");
            console.log(err);
            res.sendStatus(500);   
        }
        else{
            res.sendStatus(200);
        }
    });
});

router.delete("/db", function(req, res) {
    
    let itemID = req.body.id;  
    
    Item.findByIdAndDelete(itemID, function(err){
        if(err){
            console.log("Error: Storing to DB Failed");
            console.log(err);
            res.sendStatus(500);
        }
        else{
            res.sendStatus(200);
        }
    });
});

export default router;
