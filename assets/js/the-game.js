"use strict"
/**
 * Tic-Tac-Toe game
 *
 * @author: Andris Jancevskis
 * @email: andris.jancevskis@gmail.com
 *
 */

/**
 * Sets game parameters
 *
 * @type {{scoreDraw: number, level: string, scorePlayer: number, moveCount: number, scoreComputer: number, starts: string, player: string, computer: string, status: string}}
 */
const game = {
    player: "X",
    computer: "O",
    starts: "player",
    level: "easy",  // easy, medium and pro
    scorePlayer: 0,
    scoreComputer: 0,
    scoreDraw: 0,
    status: "before-start", // status values: before-start, game-started, game-finished
    moveCount: 0
}

/**
 * The game board DOM Object id for lines and center
 *
 * @type {{row1: string[], diag1: string[], diag2: string[], centre: string, row3: string[], col2: string[], row2: string[], col3: string[], col1: string[]}}
 */

const board = {
    centre: "cell-5",
    row1: ["cell-1", "cell-2","cell-3"],
    row2: ["cell-4", "cell-5","cell-6"],
    row3: ["cell-7", "cell-8","cell-9"],
    col1: ["cell-1", "cell-4","cell-7"],
    col2: ["cell-2", "cell-5","cell-8"],
    col3: ["cell-3", "cell-6","cell-9"],
    diag1: ["cell-1", "cell-5", "cell-9"],
    diag2: ["cell-3", "cell-5", "cell-7"]
}

/**
 * game-wide messages for displaying to a player
 *
 * @type {{msg4: string, msg3: string, msg2: string, msg1: string}}
 */

const messages = {
    msg1: "Congratulations! You won.",
    msg2: "I won. Good luck next time.",
    msg3: "Draw.",
    msg4: "Press \"Clear\" to clear the board and start another game."
}

/**
 * Gets an Object with object_id from DOM
 *
 * @param objectId
 * @returns {HTMLElement}
 */
function getDOMObjectById(objectId){
    return document.getElementById(objectId);
}

/**
 * Sets string value of 'value' to DOM object with object_id
 *
 * @param objectId
 * @param value
 */
function setDOMElementValue(objectId, value){
    let obj = getDOMObjectById(objectId);
    if(obj !== null){
        obj.innerText = value.toString();
    } else {
        console.log("No object with id '" + objectId + "' found.");
    }
}

/**
 * Gets value of DOM Object with object_id
 *
 * @param objectId
 * @returns {string}
 */
function getDOMElementValue(objectId){
    let obj = getDOMObjectById(objectId);
    if(obj !== null){
        return obj.innerText;
    } else {
        console.log("No object with id '" + objectId + "' found.");
    }
}

/**
 * Sets all score to zero
 */
function resetScore(){
    let scoreIds = ["score-player", "score-computer", "score-draw"];
    for (let val in scoreIds){
        setDOMElementValue(scoreIds[val], 0);
    }
}

/**
 * Increments score by one
 *
 * @param whatScore Which score to increment
 */
function incrementScore(whatScore) {
    let scoreId = "";
    switch(whatScore){
        case "player":
            scoreId = "score-player";
            break;
        case "computer":
            scoreId = "score-computer";
            break;
        case "draw":
            scoreId = "score-draw";
            break;
        default:
            console.log("No such score as: " + whatScore);
    }
    let score = getDOMElementValue(scoreId);
    let finalScore = Number(score) + 1;
    setDOMElementValue(scoreId, finalScore.toString());
}

/* **************************************************************
*
* Game logic
*
*****************************************************************/

/**
 * Setting message in the message box
 *
 * @param msgType What type of message to show
 * @param msgFirstLine Message's first line text
 * @param msgSecondLine Message's second line text
 */
const setMessage = (msgType, msgFirstLine, msgSecondLine) =>{
    const msgBaseClasses = ["w3-panel", "w3-center"];
    let objMessages = getDOMObjectById("message");

    objMessages.classList = [];
    msgBaseClasses.forEach((item) => {
        objMessages.classList.add(item);
    })

    switch(msgType){
        case "alert":
            objMessages.classList.add("w3-yellow");
            break;
        case "ok":
            objMessages.classList.add("w3-green");
            break;
        default:
            console.log("Unknown message type: " + msgType);
    }

    document.getElementById("msg-line-1").innerText = msgFirstLine;
    document.getElementById("msg-line-2").innerText = msgSecondLine;
};

/**
 * Resets the game to a starting position
 */
function resetGame(){
    game.status = "before-start";
    game.moveCount = 0;
    document.getElementById("bt-start-clear").innerText = "Start game";
    // enables/disables buttons
    document.getElementById("bt-give-up").disabled = true;
    document.getElementById("setup-starts").disabled = false;
    document.getElementById("setup-player").disabled = false;
    document.getElementById("setup-level").disabled = false;
    document.getElementById("bt-reset").disabled = false;
    document.getElementById("bt-submit-move").disabled = true;
    document.getElementById("bt-start-clear").disabled = false;


    // clear the board
    let cell = null;
    for (let i=1; i< 10; i++){
         cell = getDOMObjectById("cell-" + i.toString());
         cell.innerText = "";
         cell.classList.remove("occupied");
         cell.style = null;
    }
}


/**
 * when event fired on button Give Up
 */
function evBtGiveUp(){
    if (confirm("Do you really want to finish game?\nYou will loose this round.") === true){
        game.status = "game-finished";
        incrementScore("computer");

        //  Checks if board needs to be clear
        let isBoardClear = true;
        for (let i=1; i< 10; i++){
            if (getDOMElementValue("cell-" + i.toString()) !== ""){
                isBoardClear = false;
                break;
            }
        }

        if (!isBoardClear){
            // enables/disables buttons
            document.getElementById("bt-give-up").disabled = true;
            document.getElementById("bt-submit-move").disabled = true;
            document.getElementById("bt-start-clear").disabled = false;
            document.getElementById("bt-start-clear").innerText = "Clear the board";
        } else {
            resetGame();
        }

    };
};


/**
 * Check for a victory condition
 * @param whosCondition "player" or "computer"
 * @returns {string[]} a winning line or an empty array
 */

function checkVictoryCondition(whosCondition){

    // finding which symbol to look for

    let symbol = "";
    switch(whosCondition){
        case "player":
            symbol = game.player;
            break;
        case "computer":
            symbol = game.computer;
            break;
    }

    // checking for a winning line

    let playerSymbolCount = 0;
    for (let key in board){
        // excludes not needed keys from checking
        if (["centre"].includes(key)){ continue; }

        playerSymbolCount = 0;
        let key2;
        for (key2 in board[key]){
            if(getDOMElementValue(board[key][key2]) === symbol ){
                playerSymbolCount += 1;
            }
        }
        if (playerSymbolCount === 3){
            return board[key];
        }
    }
    return [];
}

/**
 * Sets visuals when player is a winner
 *
 * @param cellsIdsArray IDs of winning cells
 */
function playerWon(cellsIdsArray){
    let fontColor = "green";

    let cell = null;
    for (let key in cellsIdsArray){
        cell = getDOMObjectById(cellsIdsArray[key]);
        cell.style.color = fontColor;
        cell.style.fontWeight = "900";
    }
}

/**
 * Sets visuals when computer is a winner
 *
 * @param cellsIdsArray IDs of winning cells
 */
function computerWon(cellsIdsArray){
    let fontColor = "red";

    let cell = null;
    for (let key in cellsIdsArray){
        cell = getDOMObjectById(cellsIdsArray[key]);
        cell.style.color = fontColor;
        cell.style.fontWeight = "900";
    }
}

/**
 * Checks draw condition
 *
 * @returns {boolean} returns false if game board has an empty cell
 */
function isDraw(){
    for (let i = 1; i < 10; i++){
        if (document.getElementById("cell-"+ i.toString()).innerText === ""){
            return false;
        }
    }
    return true;
};

/**
 * Calculates RANDOM move
 */

function getRandomComputerMoveCellId(){
    let cellId = "";
    let freeCells = [];
    for (let i = 1; i < 10; i++){
        if (document.getElementById("cell-"+ i.toString()).innerText === ""){
            freeCells.push("cell-"+ i.toString());
        }
    }

    // Picks a cell by index
    let id = Math.floor(Math.random() * freeCells.length);

    cellId = freeCells[id];
    return cellId;
};

/**
 * calculates move according to the algorithm
 */
function getCalculatedComputerMoveCellId(){
    let moveCellId = "";
    let line  = [];
    let oddCells = [];
    let compSymbol = game.computer;
    let playerSymbol = game.player;

    // check immediate wins
    for (let key in board){
        if (key !== "centre") {
            line = board[key];
            oddCells = [];
            for (let val in line) {
                if (getDOMElementValue(line[val]) !== compSymbol) {
                    oddCells.push(line[val]);
                }
            }
            if (oddCells.length ===1 && getDOMElementValue(oddCells[0]) === ""){
                return oddCells[0];
            }
        }
    }

    // check immediate threats
    for (let key in board){
        if (key !== "centre") {
            line = board[key];
            oddCells = [];
            for (let val in line) {
                if (getDOMElementValue(line[val]) !== playerSymbol) {
                    oddCells.push(line[val]);
                }
            }
            if (oddCells.length ===1 && getDOMElementValue(oddCells[0]) === ""){
                return oddCells[0];
            }
        }
    }


    // Place the computer’s symbol in the centre if empty
    if (getDOMElementValue(board.centre) === ""){
        return board.centre;
    }

    // Place the computer’s symbol in the corner of two empty lines

    /**
     *  Helper function to check if line is empty
     */
    const isEmptyLine = (line) => {
        for(let i = 0; i < 3; i++){
            if(getDOMElementValue(line[i]) !== ""){
                return false;
            }
        }
        return true;
    }

    /*
    Checks rows 1 and 3, and columns 1 and 3 as center should be occupied from previous steps
     */

    if (isEmptyLine(board.row1)){
        if (isEmptyLine(board.col1)){
            return "cell-1";
        } else if (isEmptyLine(board.col3)) {
            return "cell-3";
        }
    }

    if (isEmptyLine(board.row3)){
        if (isEmptyLine(board.col1)){
            return "cell-7";
        } else if (isEmptyLine(board.col3)) {
            return "cell-9";
        }
    }

    // Place the computer’s symbol in the corner of one empty line and a single computer’s symbol on another line

    /**
     *  Helper function to check if line is empty
     */
    const doesNotHavePlayerSymbols = (line) => {
        for(let i = 0; i < 3; i++){
            if(getDOMElementValue(line[i]) === game.player){
                return false;
            }
        }
        return true;
    }

    /*
    Checks rows 1 and 3, and columns 1 and 3 as center should be occupied from previous steps
     */

    if (isEmptyLine(board.row1)){
        if(doesNotHavePlayerSymbols(board.col1)){
            return "cell-1";
        } else if (doesNotHavePlayerSymbols(board.col3)){
            return "cell-3";
        }
    }

    if (isEmptyLine(board.row3)){
        if(doesNotHavePlayerSymbols(board.col1)){
            return "cell-7";
        } else if (doesNotHavePlayerSymbols(board.col3)){
            return "cell-9";
        }
    }

    if (isEmptyLine(board.col1)){
        if(doesNotHavePlayerSymbols(board.row1)){
            return "cell-1";
        } else if (doesNotHavePlayerSymbols(board.row3)){
            return "cell-7";
        }
    }

    if (isEmptyLine(board.col3)){
        if(doesNotHavePlayerSymbols(board.row1)){
            return "cell-3";
        } else if (doesNotHavePlayerSymbols(board.row3)){
            return "cell-9";
        }
    }

    // Place the computer’s symbol on the other corner of the line with a computer’s symbol.
    let rowCols = [board.row1, board.row3, board.col1, board.col3]

    for (let key in rowCols) {
        line = rowCols[key];
        if (doesNotHavePlayerSymbols(line) && !isEmptyLine(line)) {
            if (getDOMElementValue(line[0]) !== "") {
                return line[2];
            } else if (getDOMElementValue(line[2]) !== "") {
                return line[0];
            }
        }
    }

    // there are no winning combinations left
    return getRandomComputerMoveCellId();
}

/**
 * When clicked on button "Submit move"
 */
function evBtSubmitMove(){

    if (game.status !== "game-started"){
        return;
    }

    // adds class "occupied" to player move
    let cell = null;
    for (let i=1; i< 10; i++){
        cell = getDOMObjectById("cell-" + i.toString());
        if (cell.innerText !== "" && !cell.classList.contains("occupied")){
            cell.classList.add("occupied");
        }
    }

    /*
    Checking player win condition
    */

    let winnerLine = checkVictoryCondition("player");
    if(winnerLine.length > 0){
        playerWon(winnerLine);
        setMessage("ok", messages.msg1, messages.msg4);
        game.status = "game-finished";
        setVictoryButtons();
        incrementScore("player");
        return;
    }

    /*
    Checking draw condition
    */

    if(isDraw()){
        setMessage("ok", messages.msg3, messages.msg4);
        game.status = "game-finished";
        setVictoryButtons();
        incrementScore("draw");
        return;
    }

    /*
    *
    Computer moves
    *
     */
    game.moveCount += 1;

    let moveCellId = "";
    if (game.level.toUpperCase() === "EASY" || (game.level.toUpperCase() === "MEDIUM" && game.moveCount === 1)){
        moveCellId = getRandomComputerMoveCellId();
    } else {
        moveCellId = getCalculatedComputerMoveCellId();
    }

    // make a move
    setDOMElementValue(moveCellId, game.computer);
    setMessage("ok", "Your move!", "");
    getDOMObjectById(moveCellId).classList.add("occupied");

    // prevents pressing submit more than once
    document.getElementById("bt-submit-move").disabled = true;

    /*
    Checking computer win condition
     */
    winnerLine = checkVictoryCondition("computer");
    if(winnerLine.length > 0){
        computerWon(winnerLine);
        setMessage("ok", messages.msg2, messages.msg4);
        game.status = "game-finished";
        setVictoryButtons();
        incrementScore("computer");
        return;
    }
    /*
    Checking draw condition
    */

    if(isDraw()){
        setMessage("ok", messages.msg3, messages.msg4);
        game.status = "game-finished";
        setVictoryButtons();
        incrementScore("draw");
    }
}

/**
 * Enables/disables buttons on victory
 */
function setVictoryButtons(){
    document.getElementById("bt-give-up").disabled = true;
    document.getElementById("bt-submit-move").disabled = true;
    document.getElementById("bt-start-clear").disabled = false;
    document.getElementById("setup-starts").disabled = true;
    document.getElementById("setup-player").disabled = true;
    document.getElementById("setup-level").disabled = true;
    document.getElementById("bt-reset").disabled = true;

    document.getElementById("bt-start-clear").innerText = "Clear the board";

}

/**
 * when event fired on button Start game/ Clear
 *
 * Allows game to be started
 */
function evBtStartClear(){
    if (game.status === "game-finished"){
        resetGame();
        setMessage("ok", "Fancy another game?", "Press \"Start\" button.");
        return;
    }

    setMessage("ok", "Game started!", "Pick a cell.");
    game.status = "game-started";
    game.moveCount = 0;

    // enables/disables buttons
    document.getElementById("bt-give-up").disabled = false;
    document.getElementById("bt-start-clear").disabled = true;
    document.getElementById("setup-starts").disabled = true;
    document.getElementById("setup-player").disabled = true;
    document.getElementById("setup-level").disabled = true;
    document.getElementById("bt-reset").disabled = true;

    if (game.starts === "computer"){
        evBtSubmitMove();
    }
};

/**
 * Manages Player clicks (moves) on the game board
 *
 * @param domObject The object event has fired on
 */

function evCellClick(domObject){
    let btObjSubmitMove = getDOMObjectById("bt-submit-move");

    if (game.status !== "game-started"){
        setMessage("alert", "Game is not started", "Click on \"Start game\" button");
        return;
    }

    if (domObject.classList.contains("occupied")){
        setMessage("alert", "Wrong move.", "Click on the unoccupied box.");
        return;
    } else {
        setMessage("ok", "Good!", "Keep going");
    }

    if (!domObject.classList.contains("occupied") && domObject.innerText !== "") {
        btObjSubmitMove.disabled = true;
        domObject.innerText = "";
        return;
    }

    // removing all symbols from unoccupied cells
    for (let i=1; i < 10; i++){
        if (!getDOMObjectById("cell-" + i.toString()).classList.contains("occupied")) {
            setDOMElementValue("cell-" + i.toString(), "");
        }
    }

    domObject.innerText = game.player;

    // enables button "Submit move"
    btObjSubmitMove.disabled = false;
}


/* **************************************************************
*
* Adding event listeners
*
****************************************************************/

/*
 * Synchronising player setup with settings display
 */
document.getElementById("setup-player").addEventListener("change", (e)=>{
        let symbol = "";
        switch(e.target.value){
            case "donut":
                game.player = "O";
                game.computer = "X";
                symbol = "O";
                break;
            case "cross":
                game.player = "X";
                game.computer = "O";
                symbol = "X";
                break;
            default:
                console.log("Impossible value in setup-player select");
                return;
        }
        setDOMElementValue("settings-player", symbol);
    }
)

/*
 * Synchronising level setup with settings display
 */
document.getElementById("setup-level").addEventListener("change", (e)=>{
        let symbol = e.target.value;
        game.level = symbol;
        symbol = symbol[0].toUpperCase() + symbol.substring(1);
        setDOMElementValue("settings-level", symbol);
    }
)

/*
 * Synchronising who starts with settings display
 */
document.getElementById("setup-starts").addEventListener("change", (e)=>{
        let symbol = e.target.value;
        game.starts = symbol;
        symbol = symbol[0].toUpperCase() + symbol.substring(1);
        setDOMElementValue("settings-starts", symbol);
    }
)

/*
 * Resets score
 */
document.getElementById("bt-reset").addEventListener("click", resetScore);

/*
* Listeners for the game buttons
 */

document.getElementById("bt-give-up").addEventListener("click", evBtGiveUp);
document.getElementById("bt-submit-move").addEventListener("click", evBtSubmitMove);
document.getElementById("bt-start-clear").addEventListener("click", evBtStartClear);

let cellId="";
for (let i= 1; i < 10; i++){
    cellId = "cell-" + i.toString();
    document.getElementById(cellId).addEventListener("click", (e) => {
        evCellClick(e.target);
    });
}