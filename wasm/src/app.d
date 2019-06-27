module app;

public:
extern(C):
@nogc:
nothrow:

import Sudoku;

void _start() {}

__gshared Sudoku sudoku;

// Callbacks to javascript
void jsCellUpdated(CellRef);
void jsCellSelected(CellRef);
void jsCellDeselected(CellRef);
void jsLog(immutable(char)*, uint len);
void jsSave(CellRef);

// Functions called by javascript
void newGame() {
    sudoku.newPuzzle();
}
void continueGame(ubyte* ptr, int len) {
    string json = cast(string)ptr[0..len];
    sudoku.continuePuzzle(json);
}
void cellClicked(int pos) {
    sudoku.cellClicked(pos);
}
void valueSelected(int value) {
    sudoku.valueSelected(value);
}
void scratchSelected(int scratch) {
    sudoku.scratchSelected(scratch);
}
BoardErrors* getBoardErrors() {
    sudoku.board.calculateBoardErrors();
    return &boardErrors;
}
CellRef getBoard() {
    return sudoku.board.getCellPtr();
} 
