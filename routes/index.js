var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

//landing route
router.get("/",function(req,res){
    res.render("landing");
});

// show register for
router.get("/register",function(req,res){
    res.render("register");
})

// sign up POST
router.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error",err.message);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res,function(){      //local is one kind of strategy
            req.flash("success", "Welcome to StevensYelp, "+user.username);
            res.redirect("/restaurants");
        })
    })
})

// Log in
router.get("/login",function(req,res){
    res.render("login");
})

// log in POST |middleware
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/restaurants",
        failureRedirect: "/login"
    }), function(req,res){
});

//logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "Logged you out!");
   res.redirect("/restaurants");
});


module.exports = router;

