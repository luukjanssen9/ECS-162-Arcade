# Game Arcade

This game arcade was created by Luuk Janssen and Kenneth Villafana with a target audience of fun, engaging games for kids aged 6-12. We used open source code in our project from Daryl Posnett and Ben Zarras.

## Main Page

The main page `index.html` includes four games that the user can choose from: tictactoe, math speed game, memory game, and connect 4. To access those games the user should click the respective game's image to take them to the respective html pages. All the pages use the same back button on the top left to return back to the main page. All images used include a title tag and an alt tag for user accessibility. 

## Universal Styling

`styles.css` is used by all pages in this website to keep a consistent look across html pages. More specifically, a common red background with white text for the header and a black background with white text for the footer. Additionally, the main background color is the same for all pages. 

## Tic Tac Toe

`tictactoe.html/.css/.js` were taken from Professor Daryl Posnett and imported to our game arcade. This is a standard tic tac toe game with three difficulties, `easy`, `medium`, `hard`. Easy places the O's in random locations, medium places the O's with a simple algorithm, and hard uses a minimax algorithm for optimal O's placement. There were some slight styling changes done in `tictactoe.css` to adapt his code to our project to make it look consistent with our theme.

## Math Speed Game

`math.html/.css/.js` were taken from Ben Zarras from `https://github.com/jpbida/math-game`. His github math game is an open source game under an MIT license. His version of the game starts a counter when the start button is clicked. The user would then answer as many simple math questions as they want and then click the stop button. His version of `math.js` would calculate the average time per question and would give you a category based on this average time (between `human calculator` and `probably drunk`).

## Integration of Code

Zarras's project was made in 2015, so, much of the javascript was outdated. In our project, all of the functions were updated to modern javascript syntax and style and comments were added to explain what the functions do. Additionally, a counter was added that automatically calculates the average time after 10 correct answers (vs. having to manually press the STOP button).

## Memory Game

`memorygame.html/.css/.js` were created by Luuk Janssen. This game uses images of my two dogs (Leia and Lucky).This game flips a card when it is clicked, and when a second card is clicked, it does a check to see if the two cards are the same. If they aren't the same, then the two cards are flipped back to the original number images. If they are the same, the event listeners are removed from the images and the images flipped images stay on the screen. Other elements are updated too (number of matches per match and number of tries per two cards clicked). There are also two difficulties, `easy` and `hard`. Easy difficulty has 12 images, while hard difficulty has 20 images. To play on each difficulty, click the radio button on the top and then click the `reset` button. The page is automatically loaded in easy mode on initialization.

## Connect Four

`connect4.html/.css/.js` were created by Kenneth Villafana. The code behind this game uses a similar structure as the code for the Tic Tac Toe game. Cells are split into 7 columns of 6 cells. When a user clicks on a column, the algorithm updates the lowest cell in that column, changing the color displayed. Then it determines if the player has won by checking whether the updated game state matches any win conditions. The game has 3 difficulty options: `easy`, `hard`, and `pvp`. The easy and hard difficulies alternate turns between the user and the respective selection algorithm. Easy uses random column selection, while hard uses minimax with a maximum look-ahead depth of 5 moves. The PvP difficulty allows two users to play against each other, alternating which color each turn uses.
