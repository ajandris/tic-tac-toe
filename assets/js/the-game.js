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
 * @type {{scoreDraw: number, level: string, scorePlayer: number, scoreComputer: number, starts: string, player: string, status: string}}
 */
const game = {
    player: "X",
    starts: "player",
    level: "easy",
    scorePlayer: 0,
    scoreComputer: 0,
    scoreDraw: 0,
    status: "before-start", // status values: before-start, game-started, game-finished
    moveCount: 0
}

/**
 * The game board DOM Object ids
 *
 * @type {{row1: string[], centre: string, row3: string[], col2: string[], row2: string[], col3: string[], col1: string[]}}
 *
 */
const board = {
    centre: "cell-5",
    row1: ["cell-1", "cell-2","cell-3"],
    row2: ["cell-4", "cell-5","cell-6"],
    row3: ["cell-7", "cell-8","cell-9"],
    col1: ["cell-1", "cell-4","cell-7"],
    col2: ["cell-2", "cell-5","cell-8"],
    col3: ["cell-3", "cell-6","cell-9"]
}

/**
 * Sets game status
 *
 * @param gameStatus string["before-start", "game-started", "game-finished"]
 */
function setGameStatus(gameStatus){
    switch(gameStatus){
        case "before-start":
            game.status = gameStatus;
            break;
        case "game-started":
            game.status = gameStatus;
            break;
        case "game-finished":
            game.status = gameStatus;
            break;
        default:
            console.log("Wrong game status given");
    }
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
 * @param scoreId
 */
function incrementScore(scoreId) {
    let score = getDOMElementValue(scoreId);
    score = score + 1;
    setDOMElementValue(scoreId, score);
}

/* **************************************************************
*
* Game logic
*
*****************************************************************/

function evBtGiveUp(e){

};

function evBtSubmitMove(e){

};

function evBtStartClear(e){

};

/**
 * Check player clicks (moves) on the game board
 *
 * @param domObject
 */
function evCellClick(domObject){
    if ("occupied" in domObject.classList){
        console.log("cell is occupied");
    }
    domObject.innerText = game.player;
};





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
                symbol = "O";
                break;
            case "cross":
                symbol = "X";
                break;
            default:
                console.log("Impossible value in setup-player select");
                return;
        }
        game.player = symbol;
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

document.getElementById("bt-give-up").addEventListener("click", evBtGiveUp());
document.getElementById("bt-submit-move").addEventListener("click", evBtSubmitMove());
document.getElementById("bt-start-clear").addEventListener("click", evBtStartClear());

let cellId="";
for (let i= 1; i < 10; i++){
    cellId = "cell-" + i.toString();
    document.getElementById(cellId).addEventListener("click", (e) => {
        console.log("clicked on ==== " + e.target);
        evCellClick(e.target);
    });
}