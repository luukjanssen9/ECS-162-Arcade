const cells = document.querySelectorAll('.cell');
let currentPlayer = '1'; // Player X is always the human
let gameActive = true;
let gameState = new Array(42).fill("");

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

// Event listeners to handle game start and cell interaction
document.addEventListener('DOMContentLoaded', () => {
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    document.getElementById('restartButton').addEventListener('click', restartGame);
});

function restartGame() {
    gameActive = true;
    currentPlayer = '1';
    gameState = new Array(42).fill("");
    document.getElementById('resultDisplay').innerText = "Player 1's turn";
    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.className = 'cell'; // Reset classes
    });
}

function getDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }
}

function handleCellClick(clickedCellEvent) {
    //  Get index of clicked cell
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    // If cell is valid and player 1's turn
    if (gameState[clickedCellIndex] !== "" || !gameActive || currentPlayer === 'O') {
        return;
    }

    // we respond to a click by handling the cell that has been played
    // and then updating the overall game status
    handleCellPlayed(clickedCell, clickedCellIndex);
    updateGameStatus();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    //  update gamestate array
    gameState[clickedCellIndex] = currentPlayer;
    //  update DOM 
    clickedCell.innerHTML = currentPlayer;
    //  update class of cell
    clickedCell.classList.add(currentPlayer === '1' ? 'red' : 'blue');
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
        const [a, b, c] = condition.map(index => gameState[index]);
        if (a && a === b && b === c) {
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
    let availableCells = [];
    gameState.forEach((cell, index) => {
        if (cell === "") {
            availableCells.push(index);
        }
    });

    if (availableCells.length > 0) {
        const move = availableCells[Math.floor(Math.random() * availableCells.length)];
        handleCellPlayed(cells[move], move);  // Assume this function places the mark and updates the game state
        updateGameStatus();  // Assume this function checks for a win/draw and updates the UI
    }
}