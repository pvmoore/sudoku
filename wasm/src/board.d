module board;

public:
extern (C):
@nogc:
nothrow:

import cell;
import app;
import wasm_util;
import wasm_json;

static assert(Board.sizeof == Cell.sizeof * 81);

struct BoardErrors {
    int[9] boxes;
    int[9] cols;
    int[9] rows;
}

__gshared BoardErrors boardErrors;

struct Board {
@nogc:
nothrow:
private:
    Cell[9 * 9] cells;
public:
    CellRef getCellPtr() {
        return cells.ptr;
    }

    static Board make() {
        Board b;
        CellRef c = b.cells.ptr;
        for (auto i = 0; i < b.cells.length; i++) {
            c.index = i;
            c.box = getBoxIndex(i);
            c.value = 0;
            c.isUser = false;
            c++;
        }
        return b;
    }

    void load(string jsonString) {
        //log(jsonString);

        // [{"index":0,"box":0,"value":0,"isUser":1,"scratch":[3,5]}. ...]}

        struct CellsGenerator {
            @nogc:
            nothrow:

            enum { NONE, INDEX, BOX, VALUE, ISUSER, SCRATCH };

            Board* board;
            int k = NONE;
            Cell cell;
            int cellIndex=0;

            this(Board* board) {
                this.board = board;
            }

            void onArray(bool start) {
                if(k==SCRATCH) {

                }
            }
            void onObject(bool start) {
                if(start) {
                    
                } else {
                    k = NONE;

                    board.cells[cellIndex++] = cell;

                    cell.zeroScratch();
                }
            }
            void onKey(string key) {
                switch(key) {
                    case "index": k = INDEX; break;
                    case "box": k = BOX; break;
                    case "value": k = VALUE; break;
                    case "isUser": k = ISUSER; break;
                    case "scratch": k = SCRATCH; break;
                    default: 
                        log(key); log("OOPS"); 
                        break;
                }
            }
            void onNumber(string number) {
                int n = stringToInt(number.ptr, number.length);
                final switch(k) {
                    case INDEX: cell.index = n; break;
                    case BOX: cell.box = n; break;
                    case VALUE: cell.value = n; break;
                    case ISUSER: cell.isUser = n==1; break;
                    case SCRATCH: 
                        cell.scratch[n-1] = 1;
                        break;
                }
            }
        }
        auto ss = CellsGenerator(&this);

        JSON!CellsGenerator(ss,jsonString).parse();
    }

    void save() {
        jsSave(cells.ptr);
    }

    CellRef get(int pos) {
        return &cells[pos];
    }

    static int getBoxIndex(int pos) {
        const r = pos / 27 * 3;
        const c = pos % 9 / 3;
        return r + c;
    }

    static int getRowIndex(int pos) {
        return pos / 9;
    }

    static int getColIndex(int pos) {
        return pos % 9;
    }

    List!(CellRef, 9) getBoxCells(int b) {

        const start = b / 3 * 27 + b % 3 * 3;
        List!(CellRef, 9) values;

        for (auto x = 0; x < 3; x++) {
            for (auto y = 0; y < 3; y++) {
                const index = start + x + y * 9;
                values.add(&cells[index]);
            }
        }
        return values;
    }

    List!(CellRef, 9) getRowCells(int r) {

        List!(CellRef, 9) values;

        for (auto i = 0; i < 9; i++) {
            const index = r * 9 + i;
            values.add(&cells[index]);
        }
        return values;
    }

    List!(CellRef, 9) getColCells(int c) {

        List!(CellRef, 9) values;
        for (auto i = 0; i < 9; i++) {
            const index = c + i * 9;
            values.add(&cells[index]);
        }
        return values;
    }

    List!(int, 9) getBoxValues(int box) {
        return getBoxCells(box).filter(c => c.value != 0).map(v => v.value);
    }

    List!(int, 9) getRowValues(int row) {
        return getRowCells(row).filter(c => c.value != 0).map(v => v.value);
    }

    List!(int, 9) getColValues(int col) {
        return getColCells(col).filter(c => c.value != 0).map(v => v.value);
    }

    bool isErrorRow(int r) {
        auto rowValues = getRowValues(r);
        for (auto i = 1; i <= 9; i++) {
            if (rowValues.count(i) > 1)
                return true;
        }
        return false;
    }

    bool isErrorCol(int c) {
        auto colValues = getColValues(c);
        for (auto i = 1; i <= 9; i++) {
            if (colValues.count(i) > 1)
                return true;
        }
        return false;
    }

    bool isErrorBox(int b) {
        auto boxValues = getBoxValues(b);
        for (auto i = 1; i <= 9; i++) {
            if (boxValues.count(i) > 1)
                return true;
        }
        return false;
    }
    // Return all cells that are affected by a value placed in _pos_ cell
    List!(CellRef, 9 * 3) getAffectedCells(int pos) {
        const b = getBoxIndex(pos);
        const r = getRowIndex(pos);
        const c = getColIndex(pos);

        List!(CellRef, 9 * 3) array;

        auto bv = getBoxCells(b);
        auto rv = getRowCells(r);
        auto cv = getColCells(c);

        return array.add(bv).add(rv).add(cv);
    }

    void calculateBoardErrors() {
        memset(&boardErrors, 0, BoardErrors.sizeof);

        for (auto i = 0; i < 9; i++) {
            if (isErrorBox(i)) {
                boardErrors.boxes[i] = 1;
            }
            if (isErrorCol(i)) {
                boardErrors.cols[i] = 1;
            }
            if (isErrorRow(i)) {
                boardErrors.rows[i] = 1;
            }
        }
    }
}
