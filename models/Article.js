
//Dependencies 
//-----------------------------------------------------------

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

//Creatting a new Article schema t hold all the article in the Mongo DB 
var ArticleSchema = new Schema({
  // `title` is required and of type String
  title: {
    type: String,
    required: true,
    unique : true 
  },
  // `link` is required and of type String
  link: {
    type: String,
    required: true
  },
  // `image` is required and of type String display the short snippet related to the article 
  image: {
    type: String,
    required: true
  },
  articleCreated: {
    type: Date, 
    default : Date.now
  },
  //This column will hold the flag value in case an article is saved.  
  isSaved: {
    type: Boolean, 
    required: true, 
    default : false 
  },
  // `comment` is an object that stores an array of commnet's [ Comment id's]
  // The ref property links the ObjectId to the Comment model
  // This allows us to populate the Article with an associated comment(s)
  comments: [{
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }]
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
