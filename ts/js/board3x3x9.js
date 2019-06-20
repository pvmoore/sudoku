export { Board3x3x9 };
import { Board } from "./board";
class Board3x3x9 extends Board {
    constructor() {
        super();
        this.board = new Array(9 * 9);
        this.board.fill({});
        this.clear();
    }
    getBoxIndex(pos) {
        const r = Math.trunc(pos / 27) * 3;
        const c = Math.trunc(pos % 9 / 3);
        return r + c;
    }
    getRowIndex(pos) {
        return Math.trunc(pos / 9);
    }
    getColIndex(pos) {
        return Math.trunc(pos % 9);
    }
    getBoxCells(b) {
        console.assert(b >= 0 && b < 9);
        const start = Math.trunc(b / 3) * 27 + Math.trunc(b % 3) * 3;
        const values = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 3; y++) {
                const index = start + x + y * 9;
                values.push(this.board[index]);
            }
        }
        return values;
    }
    getRowCells(r) {
        console.assert(r >= 0 && r < 9);
        const values = [];
        for (let i = 0; i < 9; i++) {
            const index = r * 9 + i;
            values.push(this.board[index]);
        }
        return values;
    }
    getColCells(c) {
        console.assert(c >= 0 && c < 9);
        const values = [];
        for (let i = 0; i < 9; i++) {
            const index = c + i * 9;
            values.push(this.board[index]);
        }
        return values;
    }
    getBoxValues(box) {
        return this.getBoxCells(box)
            .filter(c => c.value != 0)
            .map(v => v.value);
    }
    getRowValues(row) {
        return this.getRowCells(row)
            .filter(c => c.value != 0)
            .map(v => v.value);
    }
    getColValues(col) {
        return this.getColCells(col)
            .filter(c => c.value != 0)
            .map(v => v.value);
    }
    isErrorRow(r) {
        const rowValues = this.getRowValues(r);
        for (let i = 1; i <= 9; i++) {
            if (rowValues.count(i) > 1)
                return true;
        }
        return false;
    }
    isErrorCol(c) {
        const colValues = this.getColValues(c);
        for (let i = 1; i <= 9; i++) {
            if (colValues.count(i) > 1)
                return true;
        }
        return false;
    }
    isErrorBox(b) {
        const boxValues = this.getBoxValues(b);
        for (let i = 1; i <= 9; i++) {
            if (boxValues.count(i) > 1)
                return true;
        }
        return false;
    }
    getAffectedCells(pos) {
        const cells = [];
        const b = this.getBoxIndex(pos);
        const r = this.getRowIndex(pos);
        const c = this.getColIndex(pos);
        const bv = this.getBoxCells(b);
        const rv = this.getRowCells(r);
        const cv = this.getColCells(c);
        return bv.concat(rv).concat(cv);
    }
}
