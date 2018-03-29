// This code is only for Seeding Database Test 
// I didn't run seedDB() in app.js 

var mongoose = require("mongoose");
var Restaurant = require("./models/restaurant");
var Comment = require("./models/comment");

var data = [
    {
        name:"Pho Nomenon",
        image:"https://static.squarespace.com/static/53cc1616e4b0f4361f8ace24/53ebb61ee4b0aba5f6f30726/53ebb62ae4b0aba5f6f3176c/1407956522617/1000w/",
        description:"Delicious Vietnamese food, espacially rice noodles."
    },
    {
        name:"Rice Shop",
        image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1KrNN_nbuVeXH09InGIdCkMCnwlHf0wasGvrfe_oJkp__mTMU",
        description:"Authentic Chinese food and some Japanese food."
    },
    {
        name:"Ke Ming",
        image:"https://lh5.googleusercontent.com/p/AF1QipPKlSpc8TEADqLXRE2LYMrFa4iYvSUsomB2ZCVl=w213-h160-k-no",
        description:"Spicy pot is good."
    }
]

function seedDB(){
    //Remove all restaurants
    Restaurant.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed restaurants");
        //add
    })
}

module.exports = seedDB;