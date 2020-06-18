import path from "path";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "../models/user.js";

const saltRounds = 10;

const router = express.Router();
router.use(express.static('../client/public'));

mongoose.connect("mongodb://localhost:27017/PocketonomyDB", { useUnifiedTopology: true, useNewUrlParser: true })

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if(err){
            console.log(err);
        }
        else{
            if(foundUser){
                bcrypt.compare(password, foundUser.password, function(err, result) {
                    if(result){
                        const absPath = path.resolve('../client/public/budget.html');
                        res.sendFile(absPath);
                    }
                    else{
                        res.redirect("login");
                    }
                });
            }
        }
    })
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        let newUser = new User({
            email: req.body.username,
            password: hash,
            firstName: req.body.firstName, 
            lastName: req.body.lastName
        });
    
        newUser.save( err => {
            if(err){
                console.log(err);
            }
            else{
                const absPath = path.resolve('../client/public/budget.html');
                res.sendFile(absPath);
            }
        });
    });
});
 
router.get("/logout", (req, res) => {
    res.redirect("/");
})

export default router;