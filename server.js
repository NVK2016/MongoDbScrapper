//Dependencies 
// -----------------------------------

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
//Today date 
var moment = require("moment");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

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
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
      
    });

    // Send a message to the client
    // res.send("Scrape Complete");
    res.redirect("/");
    
    });
  });

  
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  