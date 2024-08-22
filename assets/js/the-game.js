/**
 * Tic-Tac-Toe game
 *
 * @author: Andris Jancevskis
 * @email: andris.jancevskis@gmail.com
 *
 */

/**
 * The game parameters
 */
let game = {
    player: "X",
    starts: "payer",
    level: "easy",
    score_player: 0,
    score_computer: 0,
    score_draw: 0
}

/**
 * The game board DOM Object ids
 *
 * @type {{row1: string[], centre: string, row3: string[], col2: string[], row2: string[], col3: string[], col1: string[]}}
 *
 */
let board = {
    centre: "cell-5",
    row1: ["cell-1", "cell-2","cell-3"],
    row2: ["cell-4", "cell-5","cell-6"],
    row3: ["cell-7", "cell-8","cell-9"],
    col1: ["cell-1", "cell-4","cell-7"],
    col2: ["cell-2", "cell-5","cell-8"],
    col3: ["cell-3", "cell-6","cell-9"]
}
