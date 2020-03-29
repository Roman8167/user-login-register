const express = require("express");
const app = express()
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/user-login";
const router = require("./routes/router");
const router2 = require("./routes/user");

mongoose.connect(url,function(err,db){
    if(err) throw err;
    console.log("Connected to the database.........")
});
app.set("view engine",'ejs');
app.use(express.static("./views"));
app.use("/",router);
app.use("/",router2);
app.use(express.urlencoded({extended:false}))
const port = 3000;
app.listen(port,()=>{
    console.log(`Server is up and running at port ${port}`)
})