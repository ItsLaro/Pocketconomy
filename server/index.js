import express from "express";
import bodyParser from "body-parser";
import path from 'path';
import itemsRoutes from "./routes/items.js";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/api/v1', itemsRoutes); //imports db routes through specified route prefix
app.use(express.static('../client/public')); //middleware to serve static files on specified dir (public)


app.get("/", function(req, res) {
    absPath = path.resolve('../client/public/index.html');
    res.sendFile(absPath);
});

app.get("/sign-out", function(req, res) {
    //TODO
    res.redirect('/sign-in');
});

app.get("/about", function(req, res) {
    
});
    
app.listen(3000, function() {
    console.log("Server started on port 3000");
  });