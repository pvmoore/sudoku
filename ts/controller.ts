export {continueGame,newGame};
import {Sudoku3x3x9} from "./sudoku3x3x9"
import {includePrototypes} from "./util";

includePrototypes();

let sudoku = null;

function continueGame() {
    sudoku = new Sudoku3x3x9();
    const game = localStorage.getItem("currentGame-ts");
    if(game) {
        sudoku.continuePuzzle();
    } else {
        newGame();
    }
}
function newGame() {
    sudoku = new Sudoku3x3x9();
    sudoku.generateNewPuzzle();
}

