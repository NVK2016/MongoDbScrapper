// Grab the articles as a json
$.getJSON("/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      console.log(data[i]._id, data[i].title)
      //Create a card 
      var newArticleDiv = $("<div class='card' >"); 
      newArticleDiv.append("<p>" + "<h2 class='card-header bg-primary'>"+data[i].title+"</h2>" 
      + "<br />  Link Below to the TV show: <a target='_blank' href='" + data[i].link + "'> "+data[i].link +" </a><br />" +
       "<p> <img class='articleImage' src=" + data[i].image+ " /> <br/>"+
       "<a data-id='" + data[i]._id + "' class='btn btn-warning' id='deletearticle'>Delete Article</a>"
       +"<a data-id='" + data[i]._id + "' class='btn btn-primary' id='savecomment'>Comment </a> </p>");


      $("#articles").append(newArticleDiv); 
    }
  });

  // event listener for "deletearticle" button to delete the saved articles
$(document).on("click", "#deletearticle", function(event) {
    // Grab the id associated with the article from the submit button
    var articleID = $(this).data("id");
    alert("Delete Article" , articleID); 

    // post request to delete the saved article whose "delete" button has been clicked
    $.ajax("/deletearticle/" + articleID, {
        method: "POST"
    }).then(function() {
        // reload the page
        location.reload();
    });
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the comments from the note section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/comment-article/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});


   // When you click the savecomment button
$(document).on("click", "#savecomment", function() {
    // Grab the id associated with the article from the submit button
    var articleID = $(this).data("id");
    // alert("Save Note for ", articleID);
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/comment-article/" + articleID,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the comments section
        $("#comments").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  