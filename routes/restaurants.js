var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant");
var middleware = require("../middleware");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
// app.use("/restaurants",restaurantRoutes);

// INDEX -show all restaurants
router.get("/",function(req,res){
    // get all restaurants from DB
    Restaurant.find({},function(err,allRestaurants){
        if(err){
            console.log(err);
        }else{
            res.render("restaurants/index",{restaurants:allRestaurants});
        }
    })
})

//CREATE - add new restaurant to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  }
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newRestaurant = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
    // Create a new restaurant and save to DB
    Restaurant.create(newRestaurant, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/restaurants");
        }
    });
  });
});

//NEW - show form to create new restaurant
router.get("/new", middleware.isLoggedIn, function(req,res){
    res.render("restaurants/new");
})

//SHOW - shows more info about one restaurant
router.get("/:id", function(req,res){
    //find the restaurant with given ID
    Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundRestaurant){
        if(err){
            console.log(err);
        }else{
            console.log(foundRestaurant);
            res.render("restaurants/show", {restaurant: foundRestaurant});
        }
    })
});

// EDIT - 
router.get("/:id/edit", middleware.checkRestaurantOwnership, function(req,res){
    Restaurant.findById(req.params.id, function(err, foundRestaurant){
        if(err){
            console.log(err);
        }else{
        res.render("restaurants/edit",{restaurant:foundRestaurant})
        }
    })
})
// UPDATE  ROUTE
router.put("/:id", middleware.checkRestaurantOwnership, function(req, res){
  geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newData = {name: req.body.restaurant.name, image: req.body.restaurant.image, description: req.body.restaurant.description, location: location, lat: lat, lng: lng};
    Restaurant.findByIdAndUpdate(req.params.id, newData, function(err, restaurant){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/restaurants/" + restaurant._id);
        }
    });
  });
});
// DELETE
router.delete("/:id",middleware.checkRestaurantOwnership,function(req,res){
    Restaurant.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect("/restaurants");
        }
    })
})

module.exports = router;