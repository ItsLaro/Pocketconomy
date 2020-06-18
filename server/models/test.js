import mongoose from "mongoose";
import User from './user.js';


mongoose.connect("mongodb://localhost:27017/PocketonomyDB", { useUnifiedTopology: true, useNewUrlParser: true });

const newUser = new User({
    email: "ireye042@fiu.edu",
    firstName: "Ivan",
    lastName: "Reyes"
});

newUser.save(function (err) {
    if (err){
        return console.log(err)}
    });