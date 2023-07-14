//jshint esversion:6
require("dotenv").config();
const express=require("express");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});
const UserSchema=new mongoose.Schema({
    email:String,
    password:String
} ) 

UserSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User=mongoose.model("User",UserSchema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})

app.get("/register",function(req,res){
    res.render("register");
})

app.get("/secrets",function(req,res){
    res.render("secrets");
})

app.get("/submit",function(req,res){
    res.render("submit");
})

app.post("/register",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    const user=new User({
        email:username,
        password:password
    })
    user.save();
    res.redirect("secrets");
})

app.post("/login",function(req,res){
    const username=req.body.username;
    const password=req.body.password;
    
    User.findOne({email:username}).then(user=>{
        console.log(username);
        console.log(password);
        if(user){
            if(user.password===password){
                res.redirect("secrets");
            }else{
                console.log("incorrect password or username");
            }
        }else{
            console.log("incorrect password or username");
        }
    },err=>{
        console.log("user not found");
    })
})

app.listen(3000,function(res,req){
    console.log("server 3000 is running")
})