
var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//comments create
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //add username and id to the comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save 
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                     req.flash("success", "Successfully created a comment!!!");
                    res.redirect('/campgrounds/' + campground._id);
                }
            });
        }
    })
})

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});
        }
    })
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
        }
    });
});

//Put route
router.put("/:comment_id",middleware.checkCommentOwnership,  function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.render("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


//Delete route
router.delete("/:comment_id",middleware.checkCommentOwnership,  function(req, res){
    // find by id and remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Not found!");
            res.redirect("back");
            console.log(err);
        } else {
            req.flash("success", "Deleted a comment");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;

