const express = require("express");
const router = express.Router();
const bcryptjs = require('bcryptjs');
const mongoose = require("mongoose");
const passport = require("passport");
require("../config/passport")(passport)

const User = require("../models/User");
router.use(passport.initialize());
router.use(passport.session())
router.get("/login",function(req,res){
    res.render("login.ejs");
});
router.get("/register",function(req,res){
    res.render("register.ejs")
});
router.post("/register",function(req,res){
    const errors = [];
    const {name,email,password,password2} = req.body
    if(!name||!email||!password||!password2){
        errors.push({msg:"Please fill all the required fields"})
    }
    if(password!=password2){
        errors.push({msg:"Passwords do not match"})
    }
    if(password.length<6){
        errors.push({msg:"Password is less than 6 characters"})
    }
    if(errors.length>0){
        res.render("register.ejs",{
            errors,
            name,
            email,
            password,
            password2
        })
    }
    else{
        User.findOne({email:email}).then((user)=>{
            if(user){
                errors.push({msg:"Email is already registered"})
                res.render("register.ejs",{
                    errors,
                    name,
                    email,
                    password,
                    password2
                })
            }
            else{
                const newUser = new User({
                    name:name,
                    email:email,
                    password:password
                })
                const saltRound = 10;
                bcryptjs.genSalt(saltRound,(err,salt)=>{
                    if(err) throw err;
                    bcryptjs.hash(newUser.password,salt,(err,hash)=>{
                        if(err) throw err;
                        newUser.password = hash
                        newUser.save().then(res.redirect("/login")).catch(err=>{
                            console.log(err)
                        })
                    })
                })
            }
            
        })
    }
    
});

//login handle
router.post("/login",function(req,res,next){
    
  passport.authenticate("local",{
    successRedirect:"/dashboard",
    failureRedirect:"/login"
  })(req,res,next)  
});
router.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/register")
})

module.exports = router