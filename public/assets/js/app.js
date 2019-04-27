// Grab the articles as a json
$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      console.log(data[i]._id, data[i].title)
      //Create a card 
      var newArticleDiv = $("<div class='card' >"); 
      newArticleDiv.append("<p>" + "<h2 class='card-header bg-primary'>"+data[i].title+"</h2>" 
      + "<br /> <a target='_blank' href='" + data[i].link + "'> "+data[i].link +" </a><br />" +
       "<p> <img class='articleImage' src=" + data[i].image+ " /> <a data-id='" + data[i]._id + "' class='btn btn-warning save' id='savearticle'>Save Article</a> </p> </p>");
      //  newArticleDiv.append($("<a class='btn btn-success save' id='savearticle'>Save Article</a>"));

      $("#articles").append(newArticleDiv); 
    }
  });

  // When you click the savearticle button
  $(document).on("click", "#savearticle", function() {
    // Grab the id associated with the article from the submit button
    var articleID = $(this).data("id");
    alert(articleID); 

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "PUT",
      url: "/savearticle/" + articleID
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
        // // Empty the notes section
        // res.json(data)
      })
      .catch(function(err){
          console.log(err)
      });
  });
  
  //Delete all Unsaved articles 
  $("#clearShows").on("click", function(event) {
    // prevent the page to refresh
    event.preventDefault();
    alert("claear all shows"); 
    // post request to delete the articles that haven't been saved
    $.ajax("/cleararticles", {
        method: "POST"
    }).then(function() {
        // reload the page
        location.reload();
    });
})

 