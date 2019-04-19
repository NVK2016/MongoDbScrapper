//Dependencies 
// -----------------------------------

var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

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
  
    request("https://www.invisionapp.com/blog", function(error, response, html) {
      
      var $ = cheerio.load(html);
  
      $(".title-link").each(function(i, element) {
        
        var title = $(element).children().text();
        var link = $(element).attr("href");
        var snippet = $(element).siblings('p').text().trim();
        var articleCreated = moment().format("YYYY MM DD hh:mm:ss");
  
        var result = {
          title: title,
          link: link,
          snippet: snippet,
          articleCreated: articleCreated,
          isSaved: false
        }
        
        console.log(result);
        
        db.Article.findOne({title:title}).then(function(data) {
          
          console.log(data);
  
          if(data === null) {
  
            db.Article.create(result).then(function(dbArticle) {
              res.json(dbArticle);
            });
          }
        }).catch(function(err) {
            res.json(err);
        });
  
      });
  
    });
  });

  
// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  