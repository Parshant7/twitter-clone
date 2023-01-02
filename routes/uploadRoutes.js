const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");


router.get("/images/:path",(req,res,next)=>{
    res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.path));
});


module.exports = router;