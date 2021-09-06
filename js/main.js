/**
 * https://codesandbox.io/s/mastermind-vyr91?file=/main.js
 * 
 * Description of the games
 *
 * feedback area:
 * Each white peg means that one of the guessed pegs is not correct.
 * Each gray peg means that one of the guessed pegs is correct, but is in the wrong hole.
 * Each black peg means that one of the guessed pegs is correct, and is in the right hole.
 * The order of the feedback pegs does not matter.
 * https://www.wikihow.com/Play-Mastermind
 */

 var puzzle = []; // puzzle array
 var guess = []; // guessed array
 var guessTableRow = 0; // table row values
 var guessTableColumn = 0; // table column values
 var resultStatus = false; // status of the result
 let bootsNumber = 0; // game reboots number
 
 const colors = [
   "green",
   "red",
   "blue",
   "purple",
   "gray",
   "yellow",
   "orange",
   "lightblue",
   "lightgreen",
   "fuchsia"
 ];
 
 // create a puzzle with random method
 const getPuzzle = () => {
   let arr = [];
   while (arr.length < 4) {
     let num = Math.floor(Math.random() * 10);
     if (!arr.includes(num)) {
       arr.push(num);
     }
   }
   return arr;
 };
 
 // evalution of guessed
 const checkTip = (puzzle, guess) => {
   /**
    * return value hit, bullseye
    */
   var bullseye = 0; // guessed pegs is correct, and is in the right hole
   var hit = 0; //guessed pegs is correct, but is in the wrong hole
 
   for (let i = 0; i < puzzle.length; i++) {
     if (puzzle[i] === guess[i]) {
       bullseye += 1;
     } else if (guess.includes(puzzle[i])) {
       hit += 1;
     }
   }
 
   return [hit, bullseye];
 };
 
 /**
  * RENDERS
  */
 
 // -----------Board
 
 const renderBoard = () => {
   let board = `
   <div class="guess-border">
     <div class="js-guess-puzzle guess visibility">
       <div class="js-guess-puzzle-0 guess-round"></div>
       <div class="js-guess-puzzle-1 guess-round"></div>
       <div class="js-guess-puzzle-2 guess-round"></div>
       <div class="js-guess-puzzle-3 guess-round"></div>
     </div>
   </div>`;
   for (let i = 9; i >= 0; i--) {
     board += `
     <div class="js-guess-${i} guess">
       <div class="js-guess-${i}-0 guess-round"></div>
       <div class="js-guess-${i}-1 guess-round"></div>
       <div class="js-guess-${i}-2 guess-round"></div>
       <div class="js-guess-${i}-3 guess-round"></div>
       <div class="js-guess-${i}-result guess-result"></div>
     </div>`;
   }
   document.querySelector(".js-guess").innerHTML = board;
 };
 
 // -----------Guess-selector board
 const renderSelector = () => {
   let board = ``;
   for (let i = 0; i <= 9; i++) {
     board += `
       <button class="js-selector-${i} selector ${colors[i]}" value=${i}></button>
     `;
   }
   document.querySelector(".js-selector-container").innerHTML = board;
 };
 


 // -----------render the puzzle and the evalution of guessed results
 const renderResult = (arr, guessTableColumn) => {
   //hit, bullseye
   let result = ``;
   let hit = arr[0];
   let bullseye = arr[1];
 
   // visibility --- visible
 
   if (guessTableColumn === 9 || bullseye === 4) {
     document.querySelector(".js-guess-puzzle").classList.remove("visibility");
     resultStatus = true;
     if (bullseye === 4) {
       renderPopupWindow("You Won!");
       addEventListenerPopupButton();
       document.querySelector(".js-popup").classList.remove("outofwindow");
     } else {
       renderPopupWindow("You Lost!");
       addEventListenerPopupButton();
       document.querySelector(".js-popup").classList.remove("outofwindow");
     }
   }
 
   for (let i = 0; i < 4; i++) {
     if (bullseye > 0) {
       result += `<div class="guess-result-render bullseyes"></div>`;
       bullseye -= 1;
     } else if (hit > 0) {
       result += `<div class="guess-result-render hit"></div>`;
       hit -= 1;
     } else {
       result += `<div class="guess-result-render none"></div>`;
     }
   }
 
   document.querySelector(
     `.js-guess-${guessTableColumn}-result`
   ).innerHTML = result;
 
   // -----------remove cursor pointer style
   document
     .querySelector(`.js-guess-${guessTableColumn}-${guessTableRow - 1}`)
     .classList.remove("cursor");
 };
 
 //  -----------render the colors
 const renderColorGuess = (value, guessTableColumn, guessTableRow) => {
   document
     .querySelector(`.js-guess-${guessTableColumn}-${guessTableRow}`)
     .classList.add(`${colors[value]}`);
 
   // -----------add cursor pointer style
   document
     .querySelector(`.js-guess-${guessTableColumn}-${guessTableRow}`)
     .classList.add("cursor");
 
   if (guessTableRow > 0) {
     document
       .querySelector(`.js-guess-${guessTableColumn}-${guessTableRow - 1}`)
       .classList.remove("cursor");
   }
 };
 
 // -----------call renderColorGuess function with the puzzle's value
 const renderPuzzle = () => {
   for (let i = 0; i < 4; i++) {
     renderColorGuess(puzzle[i], "puzzle", i);
   }
 };
 
 // -----------create delete function
 const removeGuess = (cls) => {
   let classArr = cls.classList[0];
 
   let focusBefore = `js-guess-${guessTableColumn}-${guessTableRow - 1}`;
 
   if (classArr === focusBefore) {
     let deletedValue = guess.pop();
     document
       .querySelector("." + focusBefore)
       .classList.remove(`${colors[deletedValue]}`);
     document
       .querySelector(`.js-guess-${guessTableColumn}-${guessTableRow - 1}`)
       .classList.remove("cursor");
     guessTableRow -= 1;
 
     if (guessTableRow > 0) {
       document
         .querySelector(`.js-guess-${guessTableColumn}-${guessTableRow - 1}`)
         .classList.add("cursor");
     }
   }
 };
 
 // -----------add delete function to the board pegs
 const addEventListenerGuess = () => {
   for (let i = 0; i <= 9; i++) {
     for (let j = 0; j <= 3; j++) {
       document
         .querySelector(`.js-guess-${i}-${j}`)
         .addEventListener("click", function () {
           removeGuess(this);
         });
     }
   }
 };
 
 // -----------function of the guessed-selector button
 const buttonMainFunction = (btn) => {
   let value = parseInt(btn.value, 10);
   if (resultStatus) {
     return;
   }
 
   if (!guess.includes(value)) {
     guess.push(value);
     renderColorGuess(value, guessTableColumn, guessTableRow);
     guessTableRow += 1;
   }
 
   if (guess.length === 4) {
     renderResult(checkTip(puzzle, guess), guessTableColumn);
     guess = [];
     guessTableRow = 0;
     guessTableColumn += 1;
   }
 };
 
 // -----------add eventlistener to the guessed-selector button
 const addEventListenerButton = () => {
   for (let i = 0; i <= 9; i++) {
     document
       .querySelector(`.js-selector-${i}`)
       .addEventListener("click", function () {
         buttonMainFunction(this);
       });
   }
 };
 
 //-----------render popup window
 const renderPopupWindow = (result) => {
   let instruction = "";
   let messageValue = "";
 
   if (bootsNumber === 0) {
     instruction = "Start";
     messageValue = "Welcome in the Mastermind's World";
   } else {
     instruction = "New game";
     result === "You Won!" ? (messageValue = result) : (messageValue = result);
   }
 
   let message = `<p class="message">${messageValue}</p>`;
   let btn = `
    <button class="js-starterBtn mainButton">${instruction}</button>
    `;
   document.querySelector(".js-popup").innerHTML = message + btn;
   bootsNumber += 1;
 };
 
 //-----------add eventlistener the popup window
 const addEventListenerPopupButton = () => {
   const btn = document.querySelector(".js-starterBtn");
   btn.addEventListener("click", () => {
     //add visibility style to the popup window
     if (bootsNumber === 1) {
       document.querySelector(".container").classList.remove("visibility");
     }
 
     if (bootsNumber > 0) {
       startNewGame();
     }
     startNewGame();
     document.querySelector(".js-popup").classList.add("outofwindow");
   });
 };
 
 // new game function 
 const startNewGame = () => {
   puzzle = getPuzzle();
   guess = [];
   guessTableRow = 0;
   guessTableColumn = 0;
   resultStatus = false;
   renderBoard();
   renderSelector();
   addEventListenerButton();
   addEventListenerGuess();
   renderPuzzle();
 };
 
 renderPopupWindow();
 addEventListenerPopupButton();