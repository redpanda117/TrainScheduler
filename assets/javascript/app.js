 $("#submit").on("click", function(event) {

// Preventing the submit button from trying to submit the form
// We're optionally using a form so the user may hit Enter to search instead of clicking the button
     event.preventDefault();
// grab the text from all the input box
    var train = $("#trainName").val().trim();
    var destination = $("#destination").val().trim();
    var trainFrequency =$("#trainFrequency").val().trim();

// Getting the information into the row of the table
    var appendTR = "<tr><td>" + train +"</td><td>"+ destination + "</td><td>"+ trainFrequency +"</td></tr>"
    var tableRows = $("#trainTable").append(appendTR);
     });
     