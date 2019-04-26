// Grab the articles as a json
$.getJSON("/saved", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      // Display the apropos information on the page
      console.log(data[i]._id, data[i].title)
      //Create a card 
      var newArticleDiv = $("<div class='card' >"); 
      newArticleDiv.append("<p>" + "<h2 class='card-header bg-primary'>"+data[i].title+"</h2>" 
      + "<br /> <a target='_blank' href='" + data[i].link + "'> "+data[i].link +" </a><br />" +
       "<p> <img class='articleImage' src=" + data[i].image+ " /> <a data-id='" + data[i]._id + "' class='btn btn-warning save' id='deletearticle'>Delete Article</a> </p> </p>");


      $("#articles").append(newArticleDiv); 
    }
  });
