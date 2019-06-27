module Sudoku;

public:
extern(C):
@nogc:
nothrow:

import wasm_mem;
import wasm_util;
import cell;
import board;
import app;

struct Sudoku {
@nogc:
nothrow:
public:
    Board board;
    int selectedCell = -1;

    void reset() {
        this.board = Board.make();
        this.selectedCell = -1;
    }

    void newPuzzle() {
        // todo - generate a random puzzle
        reset();

        const int[9*9] state = [
            0,2,8, 0,7,0, 0,3,1,
            0,0,7, 0,0,5, 8,0,0,
            6,0,0, 2,0,0, 0,0,0,

            0,0,0, 1,0,7, 0,0,5,
            0,1,2, 0,0,0, 9,7,0,
            7,0,0, 4,0,3, 0,0,0,

            0,0,0, 0,0,2, 0,0,6,
            0,0,4, 5,0,0, 7,0,0,
            5,3,0, 0,6,0, 2,4,0
        ];
        for(auto i=0; i<state.length; i++) {
            auto v = state[i];
            auto c = board.get(i);
            c.value = v;
            c.isUser = v==0;
            zeroMem(c.scratch.ptr, 9);

            jsCellUpdated(c);
        }
        board.save();
    }
    void continuePuzzle(string json) {
        reset();

        board.load(json);
        board.save();

        for(auto i=0; i<9*9; i++) {
            jsCellUpdated(board.get(i));
        }
    }
    void cellClicked(int pos) {
        auto cell = board.get(pos);
        if(!cell.isUser) {
            return;
        }

        if(selectedCell==pos) {
            selectedCell = -1;
            jsCellDeselected(cell);
        } else {
            if(selectedCell!=-1) {
                jsCellDeselected(board.get(selectedCell));
            }
            selectedCell = pos;
            jsCellSelected(cell);
        }
    }
    void valueSelected(int value) {
        auto cell = board.get(selectedCell);

        // Set the cell number
        if(cell.isUser) {
            if(cell.value==value) {
                // remove the set value
                cell.value = 0;
                cell.zeroScratch();
            } else {
                cell.value = value;
                cell.zeroScratch();

                // remove scratch from other affected cells
                auto affected = board.getAffectedCells(selectedCell);

                foreach(c; affected) {
                    if(c.scratch[value-1]) {
                        c.scratch[value-1] = 0;
                        jsCellUpdated(c);
                    }
                }
            }
            jsCellUpdated(cell);
            jsCellDeselected(cell);
            this.selectedCell = -1;
            board.save();
        }
    }
    void scratchSelected(int scratch) {
        auto cell = board.get(selectedCell);

        scratch--;

        // Toggle the scratch number
        if(cell.scratch[scratch]) {
            cell.scratch[scratch] = 0;
        } else {
            cell.scratch[scratch] = 1;
        }

        jsCellUpdated(cell);
        jsCellDeselected(cell);
        selectedCell = -1;
        board.save();
    }
}


