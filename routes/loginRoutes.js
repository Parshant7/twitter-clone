const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");


app.use(bodyParser.urlencoded({extended: false}));

app.set("view engine","pug");
app.set("views","views");

router.get("/",(req,res,next)=>{
    res.status(200).render("login",{pageTitle: "login"});
});

router.post("/", async (req,res,next)=>{
    
    var payload = req.body;
    payload.pageTitle = "login";
    
    if(req.body.logUsername && req.body.logPassword){

        var user = await User.findOne({
            $or:[
                {username: req.body.logUsername},
                {email: req.body.logUsername}
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong";
            res.render("login",payload);
        });

        if(user != null){
            var result = await bcrypt.compare(req.body.logPassword, user.password);

            if(result === true){
                req.session.user = user;
                return res.redirect("/");
            }
        }

        payload.errorMessage = "credentials do not match";
        return res.render("login",payload);
    }
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("login");
})

module.exports = router;