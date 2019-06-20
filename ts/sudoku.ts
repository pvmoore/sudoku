import { Board } from "./board";

export {Sudoku};

class Sudoku {
    public board:Board;

    public constructor(board:Board) {
        this.board = board;
    }
}
