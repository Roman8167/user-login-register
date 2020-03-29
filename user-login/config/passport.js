const passport = require("passport")
const localStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const mongoose = require('mongoose');
const User = require("../models/User");
const error = [];
module.exports = function(passport){
    passport.use(
        new localStrategy({usernameField:'email'},(email,password,done)=>{
            User.findOne({email:email}).then((user)=>{
                if(!user){
                    return done(null,false,{message:"Email is incorrect"})
                }
                bcryptjs.compare(password,user.password,(err,isMatch)=>{
                    if(isMatch){
                        return done(null,user)
                    }
                    else{
                        return done(null,false,{message:"Password is incorrect"})
                    }
                })
            }).catch((err)=>{
                console.log(err)
            })
        })
    )
}
passport.serializeUser((user, done)=> {
    done(null, user.id);
  });
  
  passport.deserializeUser((id, done)=> {
    User.findById(id, (err, user)=> {
      done(err, user);
    });
  })