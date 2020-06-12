const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require("mongoose");

const app = express();
const router = express.Router();

app.use(express.static('../client/public')) //middleware to serve static files on specified dir
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/v1', router); //Router sets prefix to routes.


mongoose.connect("mongodb://localhost:27017/PocketonomyDB", { useUnifiedTopology: true, useNewUrlParser: true })

const itemSchema = new mongoose.Schema({
    _id: Number,

    type: {
        type: String,
        require: true,
        maxlength: 3
    },
    description: {
        type: String,
        require: true,
        minlength: 1
    },
    value: {
        type: Number,
        require: true,
        min: 0.01
    }
});

const Item = mongoose.model("Item", itemSchema);

app.get("/", function(req, res) {
    absPath = path.resolve('../client/public/index.html');
    res.sendFile(absPath);
});

app.get("/about", function(req, res) {

});

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
    
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });