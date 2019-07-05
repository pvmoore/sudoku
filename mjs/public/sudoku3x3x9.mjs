export { Sudoku3x3x9 };
import { Sudoku } from "./sudoku.mjs";
import { Board3x3x9 } from "./board3x3x9.mjs";
import * as util from "./util.mjs";

class Sudoku3x3x9 extends Sudoku {
    constructor() {
        super(new Board3x3x9());

        this.mouseDown = (pos, event) => {
            const uiCell = event.currentTarget;
            const isUser = this.board.get(pos).isUser;

            if(this.selectedCell !== null) {
                this.selectedCell.classList.remove("selected");
            }

            if(isUser && this.selectedCell !== uiCell) {
                uiCell.classList.add("selected");
                this.selectedCell = uiCell;
                this.selectedCellIndex = pos;
                this.showNumberSelector(pos);
            } else {
                this.hideNumberSelector();
            }
        };
        this.numberListener = (e) => {
            const number = parseInt(e.target.innerText) || 0;
            if(number == 0) return;
            const isScratch = "scratch" == e.target.parentNode.id;
            const i = this.selectedCellIndex;
            const c = this.board.get(i);

            if(!c.isUser) return;

            if(isScratch) {
                // Toggle the scratch number
                if(c.scratch.includes(number)) {
                    c.scratch.remove(number);
                } else {
                    c.scratch.push(number);
                }
                c.scratch.sort();
            } else {
                // Set the cell number
                if(c.value == number) {
                    c.value = 0;
                } else {
                    c.value = number;
                }
                c.scratch = [];
                this.setErrorCells();
            }
            this.updateCell(i);
            this.hideNumberSelector();
            this.board.save();
        };

        const ns = document.getElementById("select-number");
        ns.addEventListener("mousedown", e => this.numberListener(e));

        this.selectedCell = null;
        this.selectedCellIndex = null;
    }
    //get board() { return this._board; }
    //set board(value) { this._board = value; }
    reset() {
        this.selectedCell = null;
        this.selectedCellIndex = null;
        this.deleteUI();
        this.createUI();
    }
    continuePuzzle() {
        this.reset();
        this.board.load();

        for(let i = 0; i < 9 * 9; i++) {
            this.updateCell(i);
        }
        this.setErrorCells();
    }
    generateNewPuzzle() {
        // todo - generate a random puzzle
        this.reset();

        [
            0, 2, 8, 0, 7, 0, 0, 3, 1,
            0, 0, 7, 0, 0, 5, 8, 0, 0,
            6, 0, 0, 2, 0, 0, 0, 0, 0,

            0, 0, 0, 1, 0, 7, 0, 0, 5,
            0, 1, 2, 0, 0, 0, 9, 7, 0,
            7, 0, 0, 4, 0, 3, 0, 0, 0,

            0, 0, 0, 0, 0, 2, 0, 0, 6,
            0, 0, 4, 5, 0, 0, 7, 0, 0,
            5, 3, 0, 0, 6, 0, 2, 4, 0
        ].forEach((v, i) => {
            const c = this.board.get(i);
            c.value = v;
            c.isUser = v == 0;
            c.scratch = [];
            this.updateCell(i);
        });
        this.board.save();
    }
    updateCell(pos) {
        const uiCell = this.getUICell(pos);
        const uiValue = uiCell.firstChild;
        const uiScratch = uiCell.children[1];
        const c = this.board.get(pos);

        if(c.isUser) uiValue.classList.add("userPlaced");
        uiValue.innerText = c.value == 0 ? " " : c.value.toString();

        c.scratch.sort();
        uiScratch.innerText = c.scratch.toString().replace(/,/g, "");
    }
    showNumberSelector(pos) {
        // position the select-number element
        const ns = document.getElementById("select-number");
        ns.style.display = "grid";

        // hide values that don't make sense
        document.querySelectorAll(".lowlight")
            .forEach(e => e.classList.remove("lowlight"));
        const scratch = this.board.get(pos).scratch;
        const values = this.board.getBoxValues(this.board.getBoxIndex(pos));
        const uiSel = document.getElementById("selection");
        const uiScr = document.getElementById("scratch");
        for(let i = 0; i < 9; i++) {
            if(scratch.includes(i + 1)) {
                uiScr.children[i].classList.add("lowlight");
            }
            if(values.includes(i + 1)) {
                uiSel.children[i].classList.add("lowlight");
            }
        }
    }
    hideNumberSelector() {
        const ns = document.getElementById("select-number");
        ns.style.display = "none";
        if(this.selectedCell !== null) {
            this.selectedCell.classList.remove("selected");
            this.selectedCell = null;
            this.selectedCellIndex = null;
        }
    }
    setErrorCells() {
        // remove all errors
        document.querySelectorAll(".error")
            .forEach(e => e.classList.remove("error"));

        const setErr = (selector, flag) => {
            if(flag) {
                document.querySelectorAll(selector)
                    .forEach(e => e.classList.add("error"));
            }
        };
        // boxes
        for(let b = 0; b < 9; b++) {
            setErr("#b" + b + " .cell", this.board.isErrorBox(b));
        }
        // rows
        for(let r = 0; r < 9; r++) {
            setErr(".row" + r + "", this.board.isErrorRow(r));
        }
        // cols
        for(let c = 0; c < 9; c++) {
            setErr(".col" + c, this.board.isErrorCol(c));
        }
    }
    createUI() {
        const uiBoard = document.getElementById("board");
        console.assert(uiBoard.children.length == 0);

        for(let i = 0; i < 9; i++) {
            uiBoard.appendChild(makeBox(i));
        }

        // Add event listeners
        for(let i = 0; i < 9 * 9; i++) {
            const cell = this.getUICell(i);
            cell.addEventListener("mousedown", e => this.mouseDown(i, e));
        }
    }
    deleteUI() {
        const uiBoard = document.getElementById("board");
        while(uiBoard.firstChild) {
            uiBoard.removeChild(uiBoard.firstChild);
        }
    }
    getUICell(boardPos) {
        const uiBox = this.getUIBox(boardPos);
        const r = Math.trunc(boardPos % 27 / 9);
        const c = Math.trunc(boardPos % 3);
        const cell = c + r * 3;
        return uiBox.childNodes[cell];
    }
    getUIBox(boardPos) {
        console.assert(boardPos >= 0 && boardPos < 82, `Invalid boardPos ${boardPos}`);

        const uiBoard = document.getElementById("board");
        const r = Math.trunc(boardPos / (9 * 3));
        const c = Math.trunc(boardPos % 9 / 3);
        const box = r * 3 + c;
        return uiBoard.children[box];
    }
}
//-----------------------------------------------------------------------------------------
function makeBox(boxNum) {
    const box = document.createElement("div");
    box.setAttribute("id", "b" + boxNum);
    box.setAttribute("class", "box");
    box.style.gridRow = 1 + boxNum / 3;
    box.style.gridColumn = 1 + boxNum % 3;

    for(let i = 0; i < 9; i++) {
        box.appendChild(makeCell(boxNum, i));
    }

    return box;
}
function makeCell(boxNum, cellNum) {
    const cell = document.createElement("div");
    //cell.setAttribute("id" , "b"+boxNum+"c"+cellNum);
    const r = Math.trunc(cellNum / 3) + Math.trunc(boxNum / 3) * 3;
    const c = Math.trunc(cellNum % 3) + Math.trunc(boxNum % 3) * 3;
    cell.classList.add("row" + r);
    cell.classList.add("col" + c);
    cell.classList.add("cell");
    cell.classList.add("r" + (1 + Math.trunc(cellNum / 3)));
    cell.classList.add("c" + (1 + Math.trunc(cellNum % 3)));
    //cell.innerText = "0";

    const a = document.createElement("div");
    const b = document.createElement("div");
    a.classList.add("value");
    b.classList.add("scratch");

    a.innerText = "0";
    cell.appendChild(a);
    cell.appendChild(b);

    return cell;
}