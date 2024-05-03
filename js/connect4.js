window.onload = createGameBoard();      //  called when page loads, displays board

const cols = document.querySelectorAll('.col');
let currentPlayer = '1';                // Player 1 is always the human
let gameActive = true;
let gameState = new Array(42).fill("");
let stacks = new Array(7).fill(0);      //  stores height of each stack in columns

//  Setting winning conditions
let winningConditions = [];
// Rows
for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
        winningConditions.push([7*row+col, 7*row+col+1, 7*row+col+2, 7*row+col+3]);
    }
}
// Columns
for (let col = 0; col < 7; col++) {
    for (let row = 0; row < 3; row++) {
        winningConditions.push([7*row+col, 7*(row+1)+col, 7*(row+2)+col, 7*(row+3)+col]);
    }
}
// Diagonals (bottom-left to top-right)
for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 4; col++) {
        winningConditions.push([7*row+col, 7*(row+1)+col+1, 7*(row+2)+col+2, 7*(row+3)+col+3]);
    }
}
// Diagonals (top-left to bottom-right)
for (let row = 3; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
        winningConditions.push([7*row+col, 7*(row-1)+col+1, 7*(row-2)+col+2, 7*(row-3)+col+3]);
    }
}

//  make 7 columns of 6 cells, update DOM and css
function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    let index = 0;
    //  for each column, make 6 cells
    for (let i = 0; i < 7; i++) {
        const col = document.createElement('button');
        col.classList.add("col");
        col.dataset.cellIndex = i;
        col.id = "col" + i;
        for (let j = 0; j < 6; j++) {
            const row = document.createElement("div");
            row.classList.add("cell");
            row.id = index;
            col.appendChild(row);
            index += 7;
        }
        index -= 41;
        //  add to DOM 1 column (6 cells) at a time
        //  this is so any clicked cell in a column has same effect
        gameBoard.appendChild(col);
    }
}

// Event listeners to handle game start and column interaction
//  Once HTML is done loading
document.addEventListener('DOMContentLoaded', () => {
    //  check if any column is clicked
    cols.forEach(col => col.addEventListener('click', handleColClick));
    //  check if restart button clicked
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

//  restart the game
function restartGame() {
    gameActive = true;  //  if previous game was finished, reset
    currentPlayer = '1';
    gameState = new Array(42).fill("");
    stacks = new Array(7).fill(0);
    document.getElementById('resultDisplay').innerText = "Player 1's turn";
    //  empty cells
    for (let i = 0; i < 42; i++) {
        cell = document.getElementById(i);
        cell.className = 'cell'; // Reset classes
    };
}

//  get the difficulty level
function getDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            //  returns "easy", "hard", or "pvp"
            return radios[i].value;
        }
    }
}

// handle the column click
function handleColClick(clickedColEvent) {
    //  Get index of clicked column
    let clickedCol = clickedColEvent.target;
    //  if clicked on cell over column, select parent column under cell
    if (clickedCol.classList.contains('cell')) {
        clickedCol = clickedCol.parentElement
    }
    //  get index of column
    const clickedColIndex = parseInt(clickedCol.id.split('col')[1]);

    // Check if turn and cell are valid
    if (stacks[clickedColIndex] == 6 || !gameActive || (currentPlayer === '2' && !getDifficulty() === "PvP")) {
        return;
    }

    // respond to a click by handling the col that has been played
    // and then updating the overall game status
    let played = handleColPlayed(clickedColIndex);
    //  if column played was already filled up
    if (played == -1) {
        return;
    } 
    updateGameStatus();
}

function handleColPlayed(clickedColIndex) {
    //  get next cell to fill in column (gravity)
    let lowestCell = getLowestCell(clickedColIndex);
    //  checks if computer move was in valid column
    if (lowestCell == null) {
        return -1;
    }
    //  update class of cell
    lowestCell.classList.add(currentPlayer === '1' ? 'red' : 'yellow');
    return 1;
}

// get the lowest cell in the column
function getLowestCell(col) {
    //  row, col is the x, y coordinate of placed piece
    row = stacks[col];
    if (row == 6) {
        return null;
    }
    //  increase stack height, update gamestate array, return updated cell
    stacks[col]++;
    gameState[41 - (7*row + (6 - col))] = currentPlayer;
    return document.getElementById(41 - (7*row + (6 -col)));
}

// update the game status
function updateGameStatus() {
    //  if game has been won, end game
    const result = checkWinner();
    if (result) {
        gameActive = false;
        if (result === 'tie') {
            document.getElementById('resultDisplay').innerText = "Game Draw!";
        } else {
            document.getElementById('resultDisplay').innerText = `Player ${result} Wins!`;
        }
    //  if not, next players turn
    } else {
        togglePlayer();
    }
}


// select the other player, human player starts
function togglePlayer() {
    currentPlayer = currentPlayer === '1' ? '2' : '1';
    document.getElementById('resultDisplay').innerText = "Player " + currentPlayer + "'s turn";

    // note that you can change difficulty mid game!
    if (currentPlayer === '2' && gameActive) {
        let difficulty = getDifficulty();
        if(difficulty === "easy")
            randomComputerMove();
        else if (difficulty === "hard")
            hardComputerMove(5);
        //  if difficulty set to pvp, no computer move function is called and mouse click upcates board
    }
}

// checking to see if there is currently a winner
function checkWinner() {
    // if current board state exists in winning condition, game is over
    for (let condition of winningConditions) {
        //  check if four of the same piece are in a row
        const [a, b, c, d] = condition.map(index => gameState[index]);
        if (a && a === b && b === c && c === d) {
            return a;  // '1' or '2'
        }
    }

    // if there are no longer any cells without 1 or 2
    // then there are no more empty cells to play
    if (!gameState.includes("")) {
        return 'tie'; // Game is a draw
    }
    return null; // No winner yet
}

// pick a random cell
function randomComputerMove() {
    let availableCols = []; //  available column selections
    stacks.forEach((col, index) => {
        if (col != 6) {
            availableCols.push(index);
        }
    });

    if (availableCols.length > 0) {
        // random move
        const move = availableCols[Math.floor(Math.random() * availableCols.length)];
        handleColPlayed(move);  // Places the mark and updates the game state
        updateGameStatus();  // Checks for a win/draw and updates the UI
    }
}

// The minimax algorithm for the computer move
function hardComputerMove(maxDepth) {
    let bestScore = -Infinity;
    let move = null;
    //  loop through cols
    for (let i = 0; i < stacks.length; i++) {
        //  simulate move for each column, return best score achieved
        if (stacks[i] !== 6) {
            gameState[41 - (7*stacks[i] + (6 - i))] = '2';
            stacks[i]++;
            //  gamestate, current depth, isMaximisizng, maxDepth
            let score = minimax(gameState, 0, false, maxDepth);
            //  undo move
            stacks[i]--;
            gameState[41 - (7*stacks[i] + (6 - i))] = "";
            //  save best score
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    //  if a best move is available, play it
    if (move != null) {
        handleColPlayed(move);
        updateGameStatus();
    }
    //  recursively keep simulating moves
    //  traverse gamestate tree until max depth reached
    function minimax(board, depth, isMaximizing, maxDepth) {
        //  Base cases (game won or max depth reached)
        if (depth === maxDepth) return 0;
        let winner = checkWinner();
        if (winner !== null) {
            return winner === '2' ? 10 : winner === '1' ? -10 : 0;
        }

        //  maximizing computers score
        if (isMaximizing) {
            console.log("is maximizing");
            let bestScore = -Infinity;
            //  for each next possible move, simulate game state, save score if good, undo move
            for (let i = 0; i < stacks.length; i++) {
                if (stacks[i] !== 6) {
                    board[41 - (7*stacks[i] + (6 - i))] = '2';
                    stacks[i]++;
                    let score = minimax(board, depth + 1, false, maxDepth);
                    stacks[i]--;
                    board[41 - (7*stacks[i] + (6 - i))] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        //  minimizing player's score
        } else {
            let bestScore = Infinity;
            console.log("is minimizing");
            //  for each next possible move, simulate game state, save score if good, undo move
            for (let i = 0; i < stacks.length; i++) {
                if (stacks[i] !== 6) {
                    board[41 - (7*stacks[i] + (6 - i))] = '1';
                    stacks[i]++;
                    let score = minimax(board, depth + 1, true, maxDepth);
                    stacks[i]--;
                    board[41 - (7*stacks[i] + (6 - i))] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }
}