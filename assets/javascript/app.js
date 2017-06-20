// Initialize Firebase
  var config = {
    apiKey: "AIzaSyD1KfzFhHPbtsjdHJHE44vlmr_OA4IXJ5g",
    authDomain: "train-d127a.firebaseapp.com",
    databaseURL: "https://train-d127a.firebaseio.com",
    projectId: "train-d127a",
    storageBucket: "train-d127a.appspot.com",
    messagingSenderId: "247741718762"
  };
  firebase.initializeApp(config);

//variabe that will be used
var tainName = "";
var destination = "";
var trainFrequency ="";
var firstTime = "";
var tMinutesTillTrain = "";
var nextTrain = "";

var database = firebase.database();
$("#submit").on("click", function(event) {

// Preventing the submit button from trying to submit the form
// We're optionally using a form so the user may hit Enter to search instead of clicking the button
     event.preventDefault();

// grab the text from all the input box
     trainName = $("#trainName").val().trim();
     destination = $("#destination").val().trim();
     trainFrequency =$("#trainFrequency").val().trim();
    firstTime = $("#firstTrainTime").val().trim();
    

// Code in the logic for storing and retrieving the most recent user.
    database.ref().push({
        trainName : trainName,
        destination : destination,
        trainFrequency: trainFrequency,
        firstTime: firstTime,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
//clear out the form 
    $("#trainName").val("");
    $("#destination").val("");
    $("#trainFrequency").val("");
    $("#firstTrainTime").val("");
 });

// Create Firebase "watcher"    
    database.ref().on("child_added", function(snapshot) {   

// debugging purpose
    console.log(snapshot.val());
    console.log(snapshot.val().trainName);
    console.log(snapshot.val().destination);
    console.log(snapshot.val().trainFrequency);
    console.log(snapshot.val().firstTime);

// First Time (pushed back 1 year to make sure it comes before current time)
// capital hh for military time 24hr
    var firstTimeConverted = moment(snapshot.val().firstTime, "HH:mm").subtract(1, "years");
//debugging
    console.log(firstTimeConverted);

//current time 
    var currentTime = moment();
//debugging 
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));  

// Difference between the times in minutes
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
//loging it for debuging     
    console.log("DIFFERENCE IN TIME: " + diffTime);
    
// Time apart (remainder)
//tells you how many times the train has pass through completely
    var tRemainder = diffTime % snapshot.val().trainFrequency;
    console.log(tRemainder);   

//How much time is left untill next train
    var tMinutesTillTrain = snapshot.val().trainFrequency - tRemainder;
//making sure it works     
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

// Next Train
    nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));
            
        
// Getting the information into the row of the table
    var appendTR = "<tr><td>" + snapshot.val().trainName +"</td><td>"+ snapshot.val().destination + "</td><td>"+ snapshot.val().trainFrequency+" min" + "</td><td>" + moment(nextTrain).format("HH:mm") + "</td><td>" + tMinutesTillTrain + " min" +"</td></tr>"
    var tableRows = $("#trainTable").prepend(appendTR);

// Create Error Handling
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});