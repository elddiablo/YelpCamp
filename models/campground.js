var mongoose = require("mongoose");

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name:String,
    price: String,
    image:String,
    describtion:String,
    author: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }, 
    comments: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Campground",campgroundSchema);

