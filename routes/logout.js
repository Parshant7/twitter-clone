const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");


app.use(bodyParser.urlencoded({extended: false}));

app.set("view engine","pug");
app.set("views","views");

router.get("/",(req,res,next)=>{

    if(req.session){
        req.session = null;
        res.redirect("/login");
    }
});


module.exports = router;