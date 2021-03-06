import express from "express";
import mongoose from "mongoose";
import itemModel from "../models/item.js";
import User from "../models/user.js";

let Item = itemModel.Item;
const router = express.Router();

mongoose.connect("mongodb://localhost:27017/PocketonomyDB", { useUnifiedTopology: true, useNewUrlParser: true })

router.get("/db", function(req, res) {

    Item.find({_id: 'your_id'}, "budget") //TODO: Add actual user_id from request's body (once implemented)
        .exec()
        .then((items) => {
            console.log(items);
            res.send(items);    
        })
        .catch((err) => {
            console.log("Error: Failed to retrieve income data.")
        });
});

router.post("/db", function(req, res) {

    /**
     * Creates new Item document from request.
     * Find user from request on db and attempts to push new item to its 'budget'
     */

    console.log(req.body);
    const newItem = new Item({
        _id: req.body.id,
        type: req.body.type,
        description: req.body.description,
        value: req.body.value
    });

    User.findAndUpdate(
        {_id: 'your_id'}, //TODO: Add actual user_id from request's body (once implemented)
        {$push: {budget: newItem}}, 
        {new: true}, 
        (err, result) => {
            if(err){
                console.log("Error: Storing to DB Failed.");
                console.log(err);
                res.sendStatus(500);   
            }
            else{
                res.sendStatus(200);
            }
        }
    );

});

router.delete("/db", function(req, res) {

    /**
     * Find user from request on db and attempts to pull item matching itemID from its 'budget'
     */
    
    let itemID = req.body.id;  

    User.findAndUpdate(
        {_id: 'your_id'}, //TODO: Add actual user_id from request's body (once implemented)
        {$pull: {budget: {_id: itemID}}},
        (err, result) => {
            if(err){
                console.log("Error: Deleting from DB Failed");
                console.log(err);
                res.sendStatus(500);   
            }
            else{
                res.sendStatus(200);
            }
        }
    );

});

export default router;
