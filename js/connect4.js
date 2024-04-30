window.onload = createGameBoard();    //  called when page loads

//const cells = document.querySelectorAll('.cell');
const cols = document.querySelectorAll('.col');
let currentPlayer = '1'; // Player 1 is always the human
let gameActive = true;
let gameState = new Array(42).fill("");
let stacks = new Array(7).fill(0);

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

//  make 7 columns of 6 cells 
function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    let index = 0;
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
        gameBoard.appendChild(col);
    }
}

// Event listeners to handle game start and cell interaction
document.addEventListener('DOMContentLoaded', () => {
    cols.forEach(col => col.addEventListener('click', handleColClick));
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

function restartGame() {
    gameActive = true;
    currentPlayer = '1';
    gameState = new Array(42).fill("");
    stacks = new Array(7).fill(0);
    document.getElementById('resultDisplay').innerText = "Player 1's turn";
    for (let i = 0; i < 42; i++) {
        cell = document.getElementById(i);
        cell.className = 'cell'; // Reset classes
    };
}

function getDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

function handleColClick(clickedColEvent) {
    //  Get index of clicked column
    let clickedCol = clickedColEvent.target;
    if (clickedCol.classList.contains('cell')) {
        clickedCol = clickedCol.parentElement
    }
    const clickedColIndex = parseInt(clickedCol.id.split('col')[1]);

    // If cell is valid and player 1's turn
    if (stacks[clickedColIndex] == 6 || !gameActive || currentPlayer === '2') {
        return;
    }

    // we respond to a click by handling the col that has been played
    // and then updating the overall game status
    let played = handleColPlayed(clickedColIndex);
    if (played == -1) {
        return;
    } 
    updateGameStatus();
}

function handleColPlayed(clickedColIndex) {
    //  update gamestate array
    //gameState[clickedColIndex] = currentPlayer;
    let lowestCell = getLowestCell(clickedColIndex);
    if (lowestCell == null) {
        return -1;
    }
    console.log("updated board");
    //  update DOM 
    //clickedCol.innerHTML = currentPlayer;
    //  update class of cell
    lowestCell.classList.add(currentPlayer === '1' ? 'red' : 'yellow');
    console.log("adding color to" + lowestCell.id);
    return 1;
}

function getLowestCell(col) {
    row = stacks[col];
    console.log('row', row, 'cell ', 41 - (7*row + (6 - col)));
    if (row == 6) {
        return null;
    }
    stacks[col]++;
    gameState[41 - (7*row + (6 - col))] = currentPlayer;
    return document.getElementById(41 - (7*row + (6 -col)));
}

function updateGameStatus() {
    const result = checkWinner();
    if (result) {
        gameActive = false;
        if (result === 'tie') {
            document.getElementById('resultDisplay').innerText = "Game Draw!";
        } else {
            document.getElementById('resultDisplay').innerText = `Player ${result} Wins!`;
        }
    } else {
        togglePlayer();
    }
}


// select the other player, human player starts
//
function togglePlayer() {
    currentPlayer = currentPlayer === '1' ? '2' : '1';
    document.getElementById('resultDisplay').innerText = "Player " + currentPlayer + "'s turn";

    // note that you can change difficulty mid game!
    //
    if (currentPlayer === '2' && gameActive) {
        let difficulty = getDifficulty();
        if(difficulty === "easy")
            randomComputerMove();
        else
            console.log("implement difficulty");
    }
}

// checking to see if there is currently a winner
//
function checkWinner() {

    // if the board is such that the same board state exists
    // in a winning conndition, then that player has won the game
    //
    for (let condition of winningConditions) {
        const [a, b, c, d] = condition.map(index => gameState[index]);
        if (a && a === b && b === c && c === d) {
            return a;  // '1' or '2'
        }
    }

    // if there are no longer any cells with no X or O
    // then there are no more empty cells to play
    //
    if (!gameState.includes("")) {
        return 'tie'; // Game is a draw
    }
    return null; // No winner yet
}

// The simplest computer move, just pick a random cell
//
function randomComputerMove() {
    let availableCols = [];
    stacks.forEach((col, index) => {
        if (col != 6) {
            availableCols.push(index);
        }
    });

    if (availableCols.length > 0) {
        const move = availableCols[Math.floor(Math.random() * availableCols.length)];
        handleColPlayed(move);  // Assume this function places the mark and updates the game state
        updateGameStatus();  // Assume this function checks for a win/draw and updates the UI
    }
}