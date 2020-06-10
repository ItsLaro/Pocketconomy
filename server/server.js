const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const mongoose = require("mongoose");

const app = express();
app.use(express.static('../client/public'))
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/PocketonomyDB", { useUnifiedTopology: true, useNewUrlParser: true })

const itemSchema = new mongoose.Schema({
    description: {
        type: String,
        require: true
    },
    value: {
        type: Number,
        require: true
    },
    type: {
        type: String,
        require: true,
        maxlength: 3
    }
});



const Item = mongoose.model("Item", itemSchema);

// const incomeItem = new Item({
//     description: "test Income Item",
//     value: 0,
//     type: "inc"
// });

// incomeItem.save(function(err){
//     if(err){
//         console.log("Error: Saving Unsuccessful");
//     }
// });

// const expenseItem = new Item({
//     description: "test Expense Item",
//     value: 0,
//     type: "exp"
// });

// expenseItem.save(function(err){
//     if(err){
//         console.log("Error: Saving Unsuccessful");
//     }
// });

app.get("/", function(req, res) {
    absPath = path.resolve('../client/public/index.html');
    res.sendFile(absPath);
});

app.get("/db", function(req, res) {

    Item.find({}, "type description value")
        .exec()
        .then((items) => {
            console.log(items);
            res.send(items);    
        })
        .catch((err) => {
            console.log("Error: Failed to retrieve income data.")
        });
});

app.get("/about", function(req, res) {

})
    
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });