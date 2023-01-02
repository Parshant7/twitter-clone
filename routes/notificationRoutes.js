const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");
const Chat = require("../schemas/ChatSchema");

router.get("/",(req,res,next)=>{

    res.status(200).render("notificationsPage", {
        pageTitle: "Notification",
        userLoggedIn: req.session.user,
        userLoggedInJS: JSON.stringify(req.session.user)
    });
});



module.exports = router;
