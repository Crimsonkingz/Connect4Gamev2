// Connect 4 game version 2 (using a 1D array to check for legal moves and win condition)
// Have 3 difficulties - Easy, Medium, Hard - WIP
// Difficulties will vary the possibilities of the computer making a "perfect" move

// The tokens have classes of either "empty", "player" or "computer"
// Player will be one colour and Computer will be another colour
// Player starts first as it is an advantage (want player to win more)


// Array to hold array entries that are equivalent to the game tokens but in object form rather than DOM elements
var gameGridArray = [];
// Array to hold the rows of tokens which is then put inside the gameGridArray to form a 2D array
var rowArray = [];

// Dimensions of game grid
var totalRows;
var totalColumns;
var totalTokens;

// Store win/loss state
var gameWon;

// Game grid that will hold all of the token DOM elements
var gameGrid = document.getElementById("gameGrid");

// Store possible moves of the computer
var computerMoves = [];

// Can have connect # whatever you want
var tokensToConnect = 4;

// Array to compare any number of tokens for a win
var tokensToCompare = [];


// Initialise start settings for the game
var init = function(rows, columns) {
	
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
var makeGameGridTokens = function(numRows, numColumns) {
	//Make an array that goes inside the larger game grid array
	
	
	
	// Created required number of div elements to act as tokens
	// also add objects to a 2D array for easier use in checking functions
	for (var row = 0; row < numRows; row++) {		
		// Don't you dare do array.length = 0 ever again
		var rowArray = [];

		for (var column = 0; column < numColumns; column++) {
			
			// Make and setup DOM element			
			var domToken = createDOMToken(row, column);
			// Append div element (token) to grid
			gameGrid.appendChild(domToken);

			// Add an object representing the made token into a 1D array			
				rowArray.push(createArrayToken(row, column, "empty"));		
			
		}		
		gameGridArray.push(rowArray);
	}
	console.log(gameGridArray);
}

var createDOMToken = function(row, column) {

			var token = document.createElement("div");
			token.id = "token-" + row + "-" + column;
			token.classList.add("slot", "empty");
			token.addEventListener("click", playerTokenChoice);
			
			return token;
}

var createArrayToken = function(row, column, value) {
	return {
		row: row,
		column: column,
		value: value
	};
}

// Converts "token-row-column" in to a row number and a column number in an array of [row, column]
var convertIDtoNums = function(tokenID) {
	
	var splitString = tokenID.split("-");
	var row = parseInt(splitString[1]);
	var col = parseInt(splitString[2]);

	return [row,col];
}

// Player click handler 
var playerTokenChoice = function () {
	
	var clickedToken = this;
	var clickedTokenRow = convertIDtoNums(clickedToken.id)[0];
	var clickedTokenColumn = convertIDtoNums(clickedToken.id)[1];


	// Find the token object in the array
	var clickedTokenArrayObject = gameGridArray[clickedTokenRow][clickedTokenColumn];
	

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
			setTimeout(computerTokenChoice, 1000);
		}
		else {
			alert("Well done, you win!");
		}		
	}
}

// Build simple computer AI
var computerTokenChoice = function() {

	// Populate array with legal moves
	generateMoves();
	
	// Pick a random number from the array of computer moves
	var randomChoice = Math.floor(Math.random() * computerMoves.length);

	// Pick the token
	var chosenToken = document.getElementById(computerMoves[randomChoice]);
	var chosenTokenRow = convertIDtoNums(chosenToken.id)[0];
	var chosenTokenColumn = convertIDtoNums(chosenToken.id)[1];
	
	// Update the chosen token class
	chosenToken.classList.toggle("empty");
	chosenToken.classList.toggle("computer");
	chosenToken.removeEventListener("click", playerTokenChoice);

	// Update chosen array token
	var chosenTokenArrayObject = gameGridArray[chosenTokenRow][chosenTokenColumn];
	chosenTokenArrayObject.value = "computer";


	// Check if the computer has won
	checkWin();
	if (gameWon) {
		alert("You lose!");
	}

}


var legalMove = function(arrayToken) {
	
	// Slot must be empty
	if (arrayToken.value === "empty") {
		
		// If there is a slot below
		if (tokenExists(arrayToken.row+1, arrayToken.column)) {
			
			var tokenBelow = gameGridArray[arrayToken.row+1][arrayToken.column];

			// If the slot below contains a token then it is a legal move
			if (tokenBelow.value !== "empty") {
				
				return true;
			}
			// If there isn't a token below i.e. the user clicked on a slot above an empty slot then not a legal move
			else {
				
					return false;
			}
		}
		// If there isn't a slot below then they must be on the last row
		else {
			
			return true;
		}
	}
	else {
		
		return false
	}	

}

// Checks if a row number and column number are within the bounds of the game grid
var tokenExists = function(rowNum, columnNum) {
	if (rowNum < totalRows && columnNum < totalColumns) {		
		return true;
	}
	else {		
		return false;
	}
}

// Builds an array of legal moves for the computer
var generateMoves = function() {
	// Clear previous moves
	computerMoves = [];

	// Go through each token and see if it is a possible move
	// If so, add the ID of that token to an array of possible tokens to click
	for (var tokenRow = 0; tokenRow < totalRows; tokenRow++) {
		for (var tokenCol = 0; tokenCol < totalColumns; tokenCol++) {
			if (legalMove(gameGridArray[tokenRow][tokenCol])) {
				
				computerMoves.push("token-" + tokenRow + "-" + tokenCol);
			}
		}
	}
}

var checkWin = function() {

	// Check the gameGridArray to see if there are 4 consecutive tokens in any direction
	checkRows();
	checkColumns();
	checkLtRDiags();
	checkRtLDiags();
}

var checkRows = function() {
	console.log("Checking Rows");

	
	for (var row = 0; row < totalRows; row++) {
		for (var startColumn = 0; startColumn <= totalColumns - tokensToConnect; startColumn++) {
			// Clear token checking array
			tokensToCompare = [];

			for (var i = 0; i < tokensToConnect; i++) {
				tokensToCompare.push(gameGridArray[row][startColumn+i]);

			}
			compareTokens(tokensToCompare);
		}
	}
}

var checkColumns = function() {
	console.log("Checking Columns");

	for (var column = 0; column < totalColumns; column++) {
		for (var startRow = 0; startRow <= totalRows - tokensToConnect; startRow++) {
			
			// Clear token checking array
			tokensToCompare = [];

			for (var i = 0; i < tokensToConnect; i++) {

				tokensToCompare.push(gameGridArray[startRow+i][column]);

			}
			compareTokens(tokensToCompare);
		}
	}
}
// Check diagonally from top left to bottom right
var checkLtRDiags = function() {
	console.log("Checking Left to Right Diagonals");
	

	for (var row = 0; row <= totalRows - tokensToConnect; row++) {

		for (var column = 0; column <= totalColumns - tokensToConnect; column++) {

			tokensToCompare = [];
			for (var i = 0; i < tokensToConnect; i++) {
				
				tokensToCompare.push(gameGridArray[row+i][column+i]);

			}
			
			compareTokens(tokensToCompare);
		}
	}	
	
}

// Check from top right to bottom left
var checkRtLDiags = function() {
	console.log("Checking Right to Left Diagonals");
	

	for (var row = 0; row <= totalRows - tokensToConnect; row++) {

		for (var column = tokensToConnect-1; column < totalColumns; column++) {

			tokensToCompare = [];
			for (var i = 0; i < tokensToConnect; i++) {
				
				tokensToCompare.push(gameGridArray[row+i][column-i]);

			}
			compareTokens(tokensToCompare);
		}
	}	
}

var compareTokens = function(currentTokens) {
	var sum = 0;
	for (var i = 0; i < currentTokens.length; i++) {
		
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

// Start the game
init(6,7);
