// Made by Luuk Janssen 2024
// initialize variables
const imgEl = [];
let memoryCards = [];
let turnedOver = 0;
let previousCard = 0;
let previousCardObj = {};
let numberMatches = 0;
let numberTries = 0;
let timeOut = 0;
let difficulty;
let restartButton = document.getElementById("restart-btn");
restartButton.addEventListener("click", Restart);

// initialize the board
function Init() {
    // clear the board on startup and reset
    let myNode = document.getElementById("memory-game");
    myNode.innerHTML = '';
    // get difficulty level
    getDifficulty();

    // display the images on the board based on difficulty level
    for (let i = 0; i < difficulty; i++) {
        let img = document.createElement("img");
        img.setAttribute("src", "./images/number_" + i + ".png");
        img.setAttribute("id", i.toString());
        img.setAttribute("alt", "number " + i);
        document.getElementById("memory-game").appendChild(img);
    }

    // add event listeners to call turnCard when images are clicked
    for(let i = 0; i < difficulty; i++) {
        imgEl[i] = document.getElementById(i.toString());
        imgEl[i].addEventListener("click", turnCard);
    }

    //reset memoryCards on reset
    memoryCards.length = 0;

    // add images to array of memory cards
    for(let i = 1; i < (difficulty/2+1); i++) {
        let card = {};
        card.img = "./images/" + i + ".png";
        card.id = i;
        // two cards are the same
        memoryCards.push(card);
        memoryCards.push(card);
    }
    // randomly sort array
    memoryCards.sort(() => 0.5 - Math.random());

    // load 0 initially
    document.getElementById("num-tries").innerText = "Number of tries: " + numberTries;
    document.getElementById("num-match").innerText = "Number of matches: " + numberMatches;
}

// get difficulty level from radio button and save into global variable
function getDifficulty() {
    let radios = document.getElementsByName('difficulty');
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked && radios[i].value === "easy") {
            // 12 cards for easy difficulty
            difficulty = 12; 
        }
        if (radios[i].checked && radios[i].value === "hard") {
            // 20 cards for hard difficulty
            difficulty = 20;
        }
    }
}

//turn over card when clicked
function turnCard() {
    // if we are waiting for a timeout and a card gets clicked, do nothing
    if (timeOut === 1) {
        return;
    }
    // gets id of card clicked
    let clickedCard = memoryCards[parseInt(this.getAttribute("id"))].id;
    // if its the first card (out of two cards) clicked, then flip card and save which card was flipped
    if (turnedOver === 0) {
        this.setAttribute("src", memoryCards[parseInt(this.getAttribute("id"))].img);
        previousCard = clickedCard;
        previousCardObj = this;
        turnedOver = 1;
    }
    // if its the second card (out of two cards) clicked, then:  
    else {
        numberTries++;
        document.getElementById("num-tries").innerText = "Number of tries: " + numberTries;
        if (this.getAttribute("id") === previousCardObj.getAttribute("id")) {
            this.setAttribute("src", "./images/number_" + this.getAttribute("id") + ".png");
            turnedOver = 0;
            return;
        }
        // if card is match, flip card and remove event listeners for both cards
        if (clickedCard === previousCard) {
            // show correct match gif
            this.setAttribute("src", "./images/correct-right.gif");
            // https://tenor.com/view/correct-right-your-correct-correction-you-are-right-gif-25551295
            previousCardObj.setAttribute("src", "./images/correct-right.gif");
            timeOut = 1;
            // show the cards for one second then flip them back to original numbers
            setTimeout(() => {
                this.setAttribute("src", memoryCards[parseInt(this.getAttribute("id"))].img);
                previousCardObj.setAttribute("src", memoryCards[parseInt(previousCardObj.getAttribute("id"))].img);
                timeOut = 0;
            }, 1000);
            // remove event listeners after match
            this.removeEventListener("click", turnCard);
            previousCardObj.removeEventListener("click", turnCard);
            // update number of matches
            numberMatches++;
            document.getElementById("num-match").innerText = "Number of matches: " + numberMatches;
        }
        // if card is the not a match, show card for one second then flip both back to original numbers
        else {
            // flip the cards back to original numbers
            this.setAttribute("src", memoryCards[parseInt(this.getAttribute("id"))].img);
            timeOut = 1;
            // show the cards for one second then flip them back to original numbers
            setTimeout(() => {
                this.setAttribute("src", "./images/number_" + this.getAttribute("id") + ".png");
                previousCardObj.setAttribute("src", "./images/number_" + previousCardObj.getAttribute("id") + ".png");
                timeOut = 0;
            }, 1000);
        }
        // reset turnedOver to 0
        turnedOver = 0;
    }
    // check if game is won
    if (numberMatches === difficulty/2) {
        gameFin();
    }
}

// display game win
function gameFin() {
    // show you win gif after 3 seconds
    setTimeout(() => {
        for (let i = 0; i < difficulty; i++) {
            imgEl[i].setAttribute("src", "./images/youwin.gif");
            // https://tenor.com/view/you-win-you-did-it-you-got-it-gif-15952369
        }
    }, 3000)
    
}

// reset the game
function Restart() {
    // reset the images
    for (let i = 0; i < difficulty; i++) {
        imgEl[i].setAttribute("src", "./images/number_" + i + ".png");
    }
    // reset the number of tries and matches
    numberMatches = 0;
    numberTries = 0;
    turnedOver = 0;
    // run init to reset the game
    Init();
}

// initialize the game at startup
Init();