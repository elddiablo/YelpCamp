var express  = require("express");
var app      = express();
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
var mongoose = require("mongoose");
var campgroundRoutes = require("./routes/campgrounds");
var nodemailer = require("nodemailer");
var async = require("async");
var crypto = require("crypto");

var commentRoutes = require("./routes/comments");
var indexRoutes = require("./routes/index");
var methodOverride = require("method-override");
var flash = require("connect-flash");

app.use(flash()); //tell app to use package for flash messages

// mongoose.connect("mongodb://localhost/yelp_camp");
// mongodb://elddiablo:8gEGBeqVPapa@ds255309.mlab.com:55309/yelpcamp
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"; // where databaseURl = params on the heroku settings variables
mongoose.connect(url);

// mongoose.connect("mongodb://elddiablo:8gEGBeqVPapa@ds255309.mlab.com:55309/yelpcamp");

var passport = require("passport");
var LocalStrategy = require("passport-local");
var User = require("./models/user");


// seedDB();



var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));



app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(methodOverride("_method"));

//Passport Config
app.use(require("express-session")({
    secret: "peaky blinders",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Giving all the routes user and message
app.use(function(req, res, next){
  res.locals.currentUser = req.user; 
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.get("/", function(req, res){
    res.render("landing");
});




app.use("/", indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, '127.0.0.1', function() {
    console.log('running at http://localhost:3000');
}); 
// app.listen(process.env.PORT, process.env.IP, function () {
//     var host = server.address().address;
//     var port = server.address().port;
    
// });