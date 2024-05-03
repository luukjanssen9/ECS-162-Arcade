// originally created by Ben Zarras 2015
// modified by Luuk Janssen 2024
// Added a counter that automatically calculates the average time
// after 10 correct answers (vs. having to manually press the STOP button)
// cleaned up the function calls; added comments in the code

/***** ELEMENTS *****/
let startButton = document.getElementById("start");
startButton.addEventListener("click", Start);

let stopButton = document.getElementById("stop");
stopButton.addEventListener("click", Stop);

let togoEL = document.getElementById("triestogo");

var inputField = document.getElementById("in");
var form = document.querySelector("form");
var p = document.getElementById("p");
var q = document.getElementById("q");
var op = document.getElementById("op");
var response = document.getElementById("response"); // used for Try Again text
var results = document.getElementById("results");
var category = document.getElementById("category");

/***** STATE VARIABLES *****/
var max = 20;
var num1;
var num2;
var answer;
var triesToGo = 10;

var startTime;
var endTime;

var count; // number of correct answers
var times = [];

/***** INITIALIZING *****/
inputField.className = "hide";
stopButton.className = "hide";

// this function gets called when start button is clicked or when stop is clicked
function Start() {
	// initializing the count
	togoEL.innerHTML = triesToGo + " more to go";
	count = 0;
	times = [];
	results.innerHTML = ""; // clear results
	category.innerHTML = ""; // clear category
	refreshNums();
	inputField.className = ""; // show the input field
	stopButton.className = ""; // show the stop button
	startButton.className = "hide"; // hide the start button
	inputField.focus();
};

// this is called when the answer is put in the form and enter is pressed
form.onsubmit = function(e) {
	// need to prevent the default form submission wich reloads the page
	e.preventDefault();
	getAnswer();
};

// after ten additions, the stop function is called and the average is calculated
// or stop is called at click on STOP
function Stop() {
	var resultString;
	var categoryString;
	// set the number of tries back to 10 for the next round
	triesToGo = 10;
	togoEL.innerHTML = " ";
	if (times.length > 0) {
		// getting mean time
		var total = 0;
		for (var i = 0; i < times.length; i++) {
			total += times[i];
		}
		var mean = (total / times.length) / 1000;
		resultString = "Average time: " + mean.toPrecision(4) + " sec";
		categoryString = getCategory(mean);
	} else {
		resultString = "No results recorded. Hit the Enter key to submit your answers.";
		categoryString = "";
	}

	inputField.className = "hide"; // hide the input field
	stopButton.className = "hide"; // hide the stop button
	startButton.className = ""; // show the start button

	// clear numbers and present results
	p.innerHTML = "";
	q.innerHTML = "";
	op.innerHTML = "";
	response.innerHTML = ""; // clear response in case it was set
	results.innerHTML = resultString;
	category.innerHTML = categoryString;
};

// creates 2 random numbers to be used for the addition
function refreshNums() {
	// Getting some random numbers
	num1 = Math.floor((Math.random() * max) + 1);
	num2 = Math.floor((Math.random() * max) + 1);
	// Printing numbers to user
	p.innerHTML = num1;
	op.innerHTML = "+";
	q.innerHTML = num2;
	// Starting timer
	startTime = new Date();
};

// This is called when an answer to the addition is entered
// checked whether the addition answer is correct
function getAnswer() {
	var correct = num1 + num2;
	// Getting the users attempt
	answer = parseInt(inputField.value);

	if (answer === correct) {
		// Stopping the timer and adding the time to the times array
		endTime = new Date();
		times[count++] = endTime.getTime() - startTime.getTime();
		// the answer was correct, so no need for "Try Again"
		response.innerHTML = "";
		refreshNums();
		triesToGo = triesToGo - 1;
		togoEL.innerHTML = triesToGo + " more to go";
		if (triesToGo == 0) {
			triesToGo = 10;
			togoEL.innerHTML = " ";
			Stop();
			}
	} else {
		response.innerHTML = "Try Again";
	}
	// clear the input field for the next round
	inputField.value = "";
};

// make some fun categories to report out
function getCategory(mean) {
	var c;
	if (mean < 2) {
		c = "Human Computer";
	} else if (mean < 4) {
		c = "Math Wiz";
	} else if (mean < 7) {
		c = "B Student";
	} else if (mean < 10) {
		c = "Probably Drunk";
	} else {
		c = "High School Drop Out";
	}
	return c;
};
