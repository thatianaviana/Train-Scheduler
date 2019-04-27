var config = {
    apiKey: "AIzaSyAaQICpsfakTQ6y3vVMDXkfyznKNPp3nBA",
    authDomain: "train-scheduler-41379.firebaseapp.com",
    databaseURL: "https://train-scheduler-41379.firebaseio.com",
    projectId: "train-scheduler-41379",
    storageBucket: "train-scheduler-41379.appspot.com",
    messagingSenderId: "606116488289"
};
firebase.initializeApp(config);

//the variable below reference the database
var database = firebase.database();

//setting variables for the train input information
var trainName = "";
var trainFrequency = "";
var trainDestination = "";
var firstTrainTime = "";


//gonna need to create tbody and td via jquery

// Click Button changes what is stored in firebase
$("#submit").on("click", function (event) {
    // Prevent the page from refreshing
    event.preventDefault();

    // Get inputs
    trainName = $("#train-input").val().trim();
    trainDestination = $("#destination-input").val().trim();
    firstTrainTime = $("#first-train").val().trim();
    trainFrequency = $("#frequency-input").val().trim();


    //var creating a temporary object that will hold the new info users input
    var newTrain = {
        name: trainName,
        destination: trainDestination,
        firstTrain: firstTrainTime,
        frequency: trainFrequency,
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    }

    // Change what is saved in firebase
    database.ref().push(newTrain);
    // console.log(newTrain.name);
    // console.log(newTrain.destination);
    // console.log(newTrain.firstTrain);
    // console.log(newTrain.frequency);

    // Clears all of the text-boxes - leaving only what I have written in HTML
    $("#train-input").val("");
    $("#destination-input").val("");
    $("#first-train").val("");
    $("#frequency-input").val("");
});


// this will bring the info we submitted to HTML
database.ref().on("value", function (snapshot) {

    // Print the initial data to the console.
    // console.log(snapshot.val());

    $.each(snapshot.val(), function (key, value) {
        $("#train-name").text(value.train);
        $("#train-destination").text(value.destination);
        $("#train-minutes").text(value.firstTrain);
        $("#train-frequency").text(value.frequency);

    });

    // Create Error Handling
}, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
});

// Creates a Firebase event for adding trains to the database and a row in the html
database.ref().on("child_added", function (childSnapshot) {
    // console.log(childSnapshot.val());

    // Store everything the users input into a variable
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var firstTrainTime = childSnapshot.val().firstTrain;
    var trainFrequency = childSnapshot.val().frequency;

    // console.log(trainName);
    // console.log(trainDestination);
    // console.log(firstTrainTime);
    // console.log(trainFrequency);

    //declaring a variable for the first time the train will run
    var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // creating a variable that will hold the current time using the .method() library and console logging it
    var currentTime = moment();
    console.log("Current Time:" + moment(currentTime).format("HH:mm"));

    // variable that will hold the time difference between trains
    var difference = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("Difference in Time: " + difference);

    // variable the hold the time apart between trains
    var timeRemainder = difference % trainFrequency;
    console.log(timeRemainder);

    // Mins until new train is coming - which will show under the "minutes away" row
    var minutesTillNextTrain = trainFrequency - timeRemainder;
    console.log("Minutes Until Next Train: " + minutesTillNextTrain);

    // Next train which will show under the "next arrival" row
    var nextTrain = moment().add(minutesTillNextTrain, "minutes").format("hh:mm");
    console.log("Next Arrival: " + moment(nextTrain).format("hh:mm"));


    $("tbody").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency + "</td><td>" + nextTrain + "</td><td>" + minutesTillNextTrain + "</td></tr>");

});
