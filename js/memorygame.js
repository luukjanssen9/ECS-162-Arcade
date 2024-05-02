const imgEl = [];
let memoryCards = [];
let turnedOver = 0;
let previousCard = 0;
let previousCardObj = {};
let numberMatches = 0;
let numberTries = 0;
let timeOut = 0;
let restartButton = document.getElementById("restart-btn");
restartButton.addEventListener("click", Restart);

// initialize the board
function Init() {
    // add event listeners to call turnCard when images are clicked
    for(let i = 0; i < 12; i++) {
        imgEl[i] = document.getElementById(i.toString());
        imgEl[i].addEventListener("click", turnCard);
    }

    //reset memoryCards on reset
    memoryCards.length = 0;

    // add images to array of memory cards
    for(let i = 10; i < 16; i++) {
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

//turn over card when clicked
function turnCard() {
    
    if (timeOut === 1) {
        return;
    }
    let cardNum = this.getAttribute("id");
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
            this.setAttribute("src", "./images/correct-right.gif");
            // https://tenor.com/view/correct-right-your-correct-correction-you-are-right-gif-25551295
            previousCardObj.setAttribute("src", "./images/correct-right.gif");
            timeOut = 1;
            setTimeout(() => {
                this.setAttribute("src", memoryCards[parseInt(this.getAttribute("id"))].img);
                previousCardObj.setAttribute("src", memoryCards[parseInt(previousCardObj.getAttribute("id"))].img);
                timeOut = 0;
            }, 1000);
            this.removeEventListener("click", turnCard);
            previousCardObj.removeEventListener("click", turnCard);
            // update number of matches
            numberMatches++;
            document.getElementById("num-match").innerText = "Number of matches: " + numberMatches;
        }
        // if card is the not a match, show card for one second then flip both back to original numbers
        else {
            this.setAttribute("src", memoryCards[parseInt(this.getAttribute("id"))].img);
            timeOut = 1;
            setTimeout(() => {
                let temp = 1 + parseInt(this.getAttribute("id"));
                this.setAttribute("src", "./images/number_" + this.getAttribute("id") + ".png");
                previousCardObj.setAttribute("src", "./images/number_" + previousCardObj.getAttribute("id") + ".png");
                timeOut = 0;
            }, 1000);
        }
        turnedOver = 0;
    }
    if (numberMatches === 6) {
        gameFin();
    }
}

// display game win
function gameFin() {
    setTimeout(() => {
        for (let i = 0; i < 12; i++) {
            imgEl[i].setAttribute("src", "./images/youwin.gif");
        }
    }, 3000)
    
}

// reset the game
function Restart() {
    // reset the images
    for (let i = 0; i < 12; i++) {
        imgEl[i].setAttribute("src", "./images/number_" + i + ".png");
    }
    numberMatches = 0;
    numberTries = 0;
    turnedOver = 0;
    Init();
}


Init();