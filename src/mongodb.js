const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017", {
    dbName:"LoginTutorial",

})
.then(()=>{
    console.log("mongodb connected");
})
.catch(()=>{
    console.log("failed to connect");
})

const LoginSchema = new mongoose.Schema({
    name:{
        type : String,
        required:true,
    },
    email:{
        type : String,
        required: true,
    },
    password:{
        type : String,
        required:true,
    }
})

const UserCollection = new mongoose.model("UserCollection" , LoginSchema)

module.exports = UserCollection
