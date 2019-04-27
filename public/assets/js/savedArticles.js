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
       "<a data-id='" + data[i]._id + "' class='btn btn-warning save' id='deletearticle'>Delete Article</a>"
       +"<a data-id='" + data[i]._id + "' class='btn btn-primary save' id='comment'>Comment </a> </p>");


      $("#articles").append(newArticleDiv); 
    }
  });

  // event listener for "deletearticle" button to delete the saved articles
$(document).on("click", ".deletearticle", function(event) {
    // Grab the id associated with the article from the submit button
    var articleID = $(this).data("id");
    alert(articleID); 

    // post request to delete the saved article whose "delete" button has been clicked
    $.ajax("/deletearticle/" + articleID, {
        method: "POST"
    }).then(function() {
        // reload the page
        location.reload();
    });
});


   // When you click the savenote button
$(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
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
        // Empty the notes section
        $("#notes").empty();
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  