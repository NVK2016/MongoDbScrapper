
//Dependencies 
//-----------------------------------------------------------

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Creatting a new CommentSchema to hold all the comments related to an article  in the Mongo DB 
var CommentSchema = new Schema({
});

// This creates our model from the above schema, using mongoose's model method
var Comment = mongoose.model("Comment", CommentSchema);

// Export the Comment model
module.exports = Comment;
