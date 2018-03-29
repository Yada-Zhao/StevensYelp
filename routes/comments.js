var express = require("express");
var router  = express.Router({mergeParams: true});
var Restaurant = require("../models/restaurant");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//  app.use("/restaurants/:id/comments", commentRoutes);

// NEW comment
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find restaurant
    Restaurant.findById(req.params.id, function(err, restaurant){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {restaurant:restaurant});
        }
    })
});

// Comments create
router.post("/", middleware.isLoggedIn, function(req,res){
    // find restaurant by ID
       Restaurant.findById(req.params.id, function(err, restaurant){
       if(err){
           console.log(err);
           res.redirect("/restaurants");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               req.flash("error", "Something went wrong");
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               restaurant.comments.push(comment);
               restaurant.save();
               req.flash("success", "Successfully added comment");
               res.redirect('/restaurants/' + restaurant._id);
           }
        });
       }
   });
})

// Comment EDIT 
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {restaurant_id: req.params.id, comment: foundComment});
      }
   });
});

// Comment UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
      if(err){
          res.redirect("back");
      } else {
          res.redirect("/restaurants/" + req.params.id );
      }
   });
});

// Comment DESTROY
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           req.flash("success", "Comment deleted");
           res.redirect("/restaurants/" + req.params.id);
       }
    });
});

module.exports = router;