// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      //Create a card 
      var newArticleDiv = $("<div class='card' >"); 
      newArticleDiv.append("<p id='articleNo' data-id='" + data[i]._id + "'>" + "<h2 class='card-header bg-primary'>"+data[i].title+"</h2>" 
      + "<br /> <a target='_blank' href='" + data[i].link + "'> "+data[i].link +" </a><br />" +
       "<p> <img class='articleImage' src=" + data[i].image+ " /> <a class='btn btn-success save' id='savearticle'>Save Article</a> </p> </p>");
      //  newArticleDiv.append($("<a class='btn btn-success save' id='savearticle'>Save Article</a>"));

      $("#articles").append(newArticleDiv); 
    }
  });

  // When you click the savearticle button
  $(document).on("click", "#savearticle", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data_id");
    alert(thisId); 

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "PUT",
      url: "/savearticle/" + thisId
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // Empty the notes section
        res.json(data)
      })
      .catch(function(err){
          console.log(err)
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
  