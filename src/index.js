const express = require('express');
const app = express();
const path = require("path");
const ejs = require("ejs");
const UserCollection = require("./mongodb");

const templatePath = path.join(__dirname,'../templates');

app.use(express.json());
app.set("view engine" , "ejs");
app.set("views" , templatePath);
app.use(express.urlencoded({extended:false}));
const port = 3000;

app.get('/', (req, res) => {
    res.render("login.ejs");
})

app.get('/signup', (req, res) => {
    res.render("signup.ejs");
})

app.post("/signup" , async(req,res)=>{
    const data = {
        name : req.body.name,
        password : req.body.password
    }

    await UserCollection.insertMany([data])

    res.render("home.ejs")
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`)) ;