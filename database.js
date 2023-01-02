require('dotenv').config({ override: true});
const mongoose = require("mongoose");

class Database{
    constructor(){
        this.connect();
    }

    connect(){
        mongoose.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@twitterclonecluster.bt4no.mongodb.net/TwitterCloneDB?retryWrites=true&w=majority`)
        .then(()=>{
            console.log("successfully connected");
        })
        .catch((err)=>{
            console.log("error detected "+ err);
        })
    }

}

module.exports = new Database();