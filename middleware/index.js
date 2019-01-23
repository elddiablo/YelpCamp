var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middlewareObj = {};


middlewareObj.checkCampgroundOwnership = function(req, res ,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){  //if user owns it
                    next();
                } else {
                    req.flash("error", "No permissions to do that!!!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged to do that!!!");
        res.redirect("back");
    }   
}

middlewareObj.checkCommentOwnership = function(req, res ,next){
    if(req.isAuthenticated()){ //is the user logged in??
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "Not found!!!");
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)){  //if user owns comments
                    next();
                } else {
                    req.flash("error", "No permissions to do that!!!");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged to do that!!!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res ,next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "You need to be logged in first!!!");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;