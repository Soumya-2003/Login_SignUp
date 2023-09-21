const express = require('express');
const app = express();
const path = require('path');
const ejs = require("ejs");
const session = require('express-session');
const flash = require('express-flash');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'qwerty';


const UserCollection = require("./mongodb");
const { Collection } = require('mongoose');

const templatePath = path.join(__dirname,'../templates');
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized:true,
    cookie:{
        maxAge:60000
    }
}))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.use(flash());

app.use(express.json());
app.set("view engine" , "ejs");
app.set("views" , templatePath);
app.use(express.urlencoded({extended:false}));
const port = 3000;





app.get('/', (req, res) => {
    res.render("login.ejs",{messages:req.flash()});
})

app.get('/signup', (req, res) => {
    res.render("signup.ejs");
})

app.post("/signup" , async(req,res)=>{
    const data = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password
    }

    try{
        // Insert user data into the database
        await UserCollection.insertMany([data]);

        // Generate a JWT token
        const token = jwt.sign({ userId: data._id},JWT_SECRET,{
            expiresIn: '1h' //Token expires in 1 hour
        });
        res.cookie('token',token) //Store the token in a cookie for subsequent requests
        res.redirect("/");
    }
    catch (error){
        console.error("Error during signup:",error);
        res.status(500).send("Internal Server Error");
    }
    
});

app.post("/login", async (req, res) => {
    try {
        const check = await UserCollection.findOne({ name: req.body.name });

        if (!check) {
            // User not found
            req.flash("error", "User Not Found!");
            return res.render("login.ejs", { messages: req.flash() });
        }

        if (check.password === req.body.password) {
            // Successful login, generate a JWT token
            const token = jwt.sign({ userId: check._id }, JWT_SECRET, {
                expiresIn: '1h' // Token expires in 1 hour
            });

            res.cookie('token', token); // Store the token in a cookie for subsequent requests

            req.flash("success", "Successfully login");
            return res.render("home.ejs");
        } else {
            // Incorrect password
            req.flash("error", "Wrong Password");
            return res.render("login.ejs", { messages: req.flash() });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.listen(port, () => {console.log(`Example app listening on port ${port}!`)}) ;
