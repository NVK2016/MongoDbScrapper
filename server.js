//Dependencies 
// -----------------------------------

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path"); 
//Today date 
var moment = require("moment");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// set the port of the application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);


// Routes
// --------------------------------------------------- 
//Home page route 
app.get('/',function(req,res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// //
app.get('/cleararticles',function(req,res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//Display Saved Articles 
app.get('/savedarticles',function(req,res) {
  res.sendFile(path.join(__dirname, 'public/saved.html'));
});


// A GET route for scraping the invision blog
app.get("/scrape", function(req, res) {

  console.log("Inside scrape route");

    // First, we grab the body of the html with axios
  axios.get("https://www.foxnews.com/shows").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    $(".showpage").each(function(i, element) {
      
      var title =  $(element).find("h2").text().trim();
      var link = "https://www.foxnews.com"+ $(element).find("div .m a").attr("href");
      // var description = $(element).siblings('p').text().trim();
      var image = $(element).find("img").attr("src");
      var articleCreated = moment().format("YYYY MM DD hh:mm:ss");

      var result = {
        title: title,
        link: link,
        image: image,
        articleCreated: articleCreated,
        isSaved: false
      }
      
      // conssole.log(result, image);
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          res.json(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          res.json(err);
        });
      
    });

    // Send a message to the client
    // res.send("Scrape Complete");
    res.redirect("/");
    
    });
  });

  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  // Updated the article that is saved 
app.put("/savearticle/:id", function(req, res){
  console.log(
    "Save article", req.params.id
  );
  db.Article.findOneAndUpdate({_id: req.params.id}, {isSaved: true}, {new:true})
  .then(function(dbArticle){
          res.json(dbArticle);
      })
  .catch(function(err){
      res.json(err)
  })
});

  // delete the saved article 
  app.post("/deletearticle/:id", function(req, res){
    console.log(
      "Delete Saved article", req.params.id
    );
    db.Article.deleteOne({_id: req.params.id})
    .then(function(dbArticle){
            res.json(dbArticle);
        })
    .catch(function(err){
        res.json(err)
    })
    // end the connection
    res.end();
  });


// To popuplate the comment's associated Article
app.get("/comment-article/:id", function(req, res) {
   // find one - the saved article whose "note" button has been clicked
   db.Article.findOne({ _id: req.params.id })
   // populate all of the notes associated with it
   .populate("Comment")
   .then(function(dbArticle) {

       res.json(dbArticle);
   })
   .catch(function(err) {

       res.json(err);
   });
});

// Route for saving/updating an Article's associated Note
app.post("/comment-article/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
      // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({ _id: req.params.id }, {$set:{ comments: dbComment._id }}, { new: true });
    })
    .then(function(dbArticle) {
      // If we were able to successfully update an Article, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

console.log("1");

//Loads all the Saved atricles on the site 
app.get("/saved", function (req, res) {
  console.log("2");
  db.Article.find(
    { isSaved: true }
  ).then(function (savedArticles) {
    res.json(savedArticles);
  })
})

//clear all the unsaved articles from the mongo db
app.post("/cleararticles", function(req, res){
  console.log("Clear button clicked"); 
 
  db.Article.deleteMany({isSaved: false})
  .then(function(dbArticle){
    console.log("Removed all records fro m the database", dbArticle ); 
  })
  .catch(function(err){
      console.log(err)
  }
  )
  //Reditect to Home page 
  res.redirect("/");
});

  
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  