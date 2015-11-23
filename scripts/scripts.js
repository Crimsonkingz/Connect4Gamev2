// Connect 4 game version 2 (using a 1D array to check for legal moves and win condition)
// Have 3 difficulties - Easy, Medium, Hard - WIP
// Difficulties will vary the possibilities of the computer making a "perfect" move

// The tokens have classes of either "empty", "player" or "computer"
// Player will be one colour and Computer will be another colour
// Player starts first as it is an advantage (want player to win more)

// Array to hold all the created div elements/game discs
var gameGridArray = [];

// Dimensions of game grid
var totalRows;
var totalColumns;
var totalTokens;

// Store win/loss state
var gameWon;

// Game grid that will hold all of the divs
var gameGrid = document.getElementById("gameGrid");

// Store possible moves of the computer
var computerMoves = [];

// Can have connect whatever you want
var tokensToConnect = 4;

var tokensToCompare = [];
// Initialise start settings for the game
function init(rows, columns) {
	
	// Reset game state
	gameWon = false;

	// Set global variables
	totalTokens = rows * columns;	
	totalRows = rows;
	totalColumns = columns;

	// If the game grid is already populated and needs to be cleared
	if (gameGrid.children !== null && gameGrid.children.length !== 0) {
		
		for (var i = 0; i < gameGrid.length; i++) {
			gameGrid.removeChild(gameGrid.children[i]);
		}
	}
	
	
	// Creates tokens and an array to represent these tokens
	makeGameGridTokens(rows, columns);	

}



// Connect 4 typically has 6 rows and 7 columns (wikipedia)
function makeGameGridTokens(numRows, numColumns) {



	// Created required number of div elements to act as tokens
	// also add objects to a 1D array for easier use in checking functions
	for (var i = 0; i < totalTokens; i++) {
		// Make and setup DOM element
		var token = document.createElement("div");
		token.id = "token-" + i;
		token.classList.add("slot", "empty");
		token.addEventListener("click", playerTokenChoice);
		gameGrid.appendChild(token);


		// Add an object representing the made token into a 1D array
		gameGridArray.push({
			index: i,
			value: "empty"
		})

	}

}	

// Player click handler 
function playerTokenChoice() {
	
	var clickedToken = this;
	var clickedTokenID = parseInt(clickedToken.id.substring(6));
	console.log("Clicked Token ID: " + clickedTokenID);

	// Find the token object in the array
	var clickedTokenArrayObject = gameGridArray[clickedTokenID];


	// If the clicked on slot is a legal move
	if (legalMove(clickedTokenArrayObject)) {
		// Remove empty class and replace with player class
		clickedToken.classList.toggle("empty");
		clickedToken.classList.toggle("player");		
		// Remove click event listener
		clickedToken.removeEventListener("click", playerTokenChoice);

		// Update array object
		clickedTokenArrayObject.value = "player";

		// Check if the player has won the game
		checkWin();
		// If the game has not been won then the computer takes its turn after 1 second
		// Otherwise create a player won message
		if (!gameWon) {
			// setTimeout(computerTokenChoice, 1000);
		}
		else {
			alert("Well done, you win!");
		}		
	}
}

// Build simple computer AI
function computerTokenChoice() {

	// Populate array with legal moves
	generateMoves();
	
	// Pick a random number from the array of computer moves
	var randomChoice = Math.floor(Math.random() * computerMoves.length);

	// Pick the token
	var chosenToken = document.getElementById(computerMoves[randomChoice]);
	var chosenTokenID = parseInt(chosenToken.id.substring(6));
	
	// Update the chosen token class
	chosenToken.classList.toggle("empty");
	chosenToken.classList.toggle("computer");
	chosenToken.removeEventListener("click", playerTokenChoice);

	// Update chosen array token
	var chosenTokenArrayObject = gameGridArray[chosenTokenID];
	chosenTokenArrayObject.value = "computer";


	// Check if the computer has won
	checkWin();
	if (gameWon) {
		alert("You lose!");
	}

}


function legalMove(arrayToken) {
	// var row = Math.floor(arrayToken.id / totalColumns);
	// console.log("Row: " + row);
	// var column = arrayToken.id % totalColumns;
	// console.log("Column: " + column);
	
	if (arrayToken.value === "empty") {
		var tokenBelowID = arrayToken.index + totalColumns;
		
		var tokenBelow = gameGridArray[tokenBelowID];
		// Legal move if it is the last row
		if (tokenBelowID >= totalTokens || tokenBelow == null) {
			return true;
		}
		// Legal move if there is a token below belonging to the player or computer
		else if (tokenBelow.value !== "empty") {
			return true;
		}
		else {
			return false;
		}
	}	
}

// Builds an array of legal moves for the computer
function generateMoves() {
	// Clear previous moves
	computerMoves.length = 0;

	// Go through each token and see if it is a possible move
	// If so, add the ID of that token to an array of possible tokens to click
	for (var token = 0; token < totalTokens; token++) {
		if (legalMove(gameGridArray[token])) {
			console.log("token " + token + " is a legal move");
			computerMoves.push("token-" + token);
		}
	}
}

function checkWin() {

	// Check the gameGridArray to see if there are 4 consecutive tokens in any direction
	// checkRows();
	// checkColumns();
	checkLtRDiags();
	// checkRtLDiags();
}

function checkRows() {
	console.log("Checking Rows");

	

	for (var startToken = 0; startToken <= totalTokens - tokensToConnect; startToken++) {
		// Clear token checking array
		tokensToCompare.length = 0;

		for (var i = 0; i < tokensToConnect; i++) {
			tokensToCompare.push(gameGridArray[startToken+i]);

		}
		compareTokens(tokensToCompare);
	}
}

function checkColumns() {
	console.log("Checking Columns");

	

	for (var startToken = 0; startToken <= (totalTokens + totalColumns -1) - (totalColumns * tokensToConnect); startToken++) {
		// Clear token checking array
		tokensToCompare.length = 0;

		for (var i = 0; i < tokensToConnect; i++) {
			tokensToCompare.push(gameGridArray[startToken + (i*totalColumns)]);
		}
		// Compare the next X tokens
		compareTokens(tokensToCompare);
	}
}
// Check diagonally from top left to bottom right
function checkLtRDiags() {
	console.log("Checking Left to Right Diagonals");

	for (var startToken = 0; startToken <= (totalTokens + totalColumns - tokensToConnect) - (totalColumns * tokensToConnect); startToken++) {
		// Clear token checking array
		tokensToCompare.length = 0;

		for (var i = 0; i < tokensToConnect; i++) {
			tokensToCompare.push(gameGridArray[startToken + (i*totalColumns) + i]);
		}
		// Compare the next X tokens
		compareTokens(tokensToCompare);
	}
}
// Check from top right to bottom left
function checkRtLDiags() {
	console.log("Checking Right to Left Diagonals");

	// Clear token checking array
	tokensToCompare.length = 0;
}

function compareTokens(currentTokens) {
	var sum = 0;
	for (var i = 0; i < currentTokens.length; i++) {
		console.log(currentTokens[i].index);
		if (currentTokens[i].value === "player") {
			sum += 1;
		}
		else if (currentTokens[i].value === "computer") {
			sum += -1;
		}
	}
	// If the player or computer has won the sum will be (in a regular connect 4) either +4 or -4
	if (sum === tokensToConnect || sum === (-1 *tokensToConnect)) {
		gameWon = true;
	}
}
init(6,7);
