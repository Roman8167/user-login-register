const express = require("express");
const router = express.Router();
const{ensureAuthenticated} = require("../config/auth");
const passport = require("passport");
require("../config/passport")(passport)
router.use(express.urlencoded({extended:false}))
router.get('/',function(req,res){
    res.render("welcome.ejs")
});
router.get("/dashboard",ensureAuthenticated,function(req,res){
    res.render("dashboard.ejs")
})
module.exports = router