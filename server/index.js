import path from 'path';
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";

import itemsRoutes from "./routes/items.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(express.static('../client/public')); //middleware to serve static files on specified dir (public)
app.set("view engine", "ejs");
app.set('views', path.resolve('../client/views'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/v1', itemsRoutes);
app.use('/api/v1', userRoutes); 


app.get("/", function(req, res) {
    res.render("welcome");
});    

app.get("/budget", function(req, res) {
    const absPath = path.resolve('../client/public/budget.html');
    res.sendFile(absPath);
});
    
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });