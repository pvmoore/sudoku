export { continueOrCreatePuzzle, createPuzzle };

function continueOrCreatePuzzle() {
    const game = localStorage.getItem("currentGame-reactjs");
    if(game) {
        const game = localStorage.getItem("currentGame-reactjs");
        const cells = JSON.parse(game);

        const newState = {
            ...State,
            cells: cells,
            selectedCell: null
        };
        newState.setErrors();
        return newState;
    }
    return createPuzzle();
}
function createPuzzle() {
    const newState = {
        ...State,
        cells: [
            0, 2, 8, 0, 7, 0, 0, 3, 1,
            0, 0, 7, 0, 0, 5, 8, 0, 0,
            6, 0, 0, 2, 0, 0, 0, 0, 0,

            0, 0, 0, 1, 0, 7, 0, 0, 5,
            0, 1, 2, 0, 0, 0, 9, 7, 0,
            7, 0, 0, 4, 0, 3, 0, 0, 0,

            0, 0, 0, 0, 0, 2, 0, 0, 6,
            0, 0, 4, 5, 0, 0, 7, 0, 0,
            5, 3, 0, 0, 6, 0, 2, 4, 0
        ].map((v, i) => {
            return {
                index: i,           // cell index
                value: v,           // 0 to 9 (0==unset)
                isUser: v === 0,    // true if placed by user
                scratch: []         // 
            }
        }),
        selectedCell: null
    }
    newState.setErrors();
    return newState;
}

const State = {
    cells: new Array(81).fill({}),
    selectedCell: null,

    getBoxIndex: function (pos) {
        const r = Math.trunc(pos / 27) * 3;
        const c = Math.trunc(pos % 9 / 3);
        return r + c;
    },
    getRowIndex: function (pos) {
        return Math.trunc(pos / 9);
    },
    getColIndex: function (pos) {
        return Math.trunc(pos % 9);
    },
    getBoxCells: function (b) {
        const start = Math.trunc(b / 3) * 27 + Math.trunc(b % 3) * 3;
        const values = [];

        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                const index = start + x + y * 9;
                values.push(this.cells[index]);
            }
        }
        return values;
    },
    getRowCells: function (r) {
        const values = [];
        for(let i = 0; i < 9; i++) {
            const index = r * 9 + i;
            values.push(this.cells[index]);
        }
        return values;
    },
    getColCells: function (c) {
        const values = [];
        for(let i = 0; i < 9; i++) {
            const index = c + i * 9;
            values.push(this.cells[index]);
        }
        return values;
    },
    getBoxValues: function (box) {
        return this.getBoxCells(box)
            .filter(c => c.value !== 0)
            .map(v => v.value);
    },
    getRowValues: function (row) {
        return this.getRowCells(row)
            .filter(c => c.value !== 0)
            .map(v => v.value);
    },
    getColValues: function (col) {
        return this.getColCells(col)
            .filter(c => c.value !== 0)
            .map(v => v.value);
    },
    isErrorRow: function (r) {
        const rowValues = this.getRowValues(r);
        for(let i = 1; i <= 9; i++) {
            if(count(rowValues, i) > 1) return true;
        }
        return false;
    },
    isErrorCol: function (c) {
        const colValues = this.getColValues(c);
        for(let i = 1; i <= 9; i++) {
            if(count(colValues, i) > 1) return true;
        }
        return false;
    },
    isErrorBox: function (b) {
        const boxValues = this.getBoxValues(b);
        for(let i = 1; i <= 9; i++) {
            if(count(boxValues, i) > 1) return true;
        }
        return false;
    },
    getAffectedCells: function (pos) {
        const b = this.getBoxIndex(pos);
        const r = this.getRowIndex(pos);
        const c = this.getColIndex(pos);

        const bv = this.getBoxCells(b);
        const rv = this.getRowCells(r);
        const cv = this.getColCells(c);
        return bv.concat(rv).concat(cv);
    },
    setErrors: function () {
        /** Remove all errors */
        document.querySelectorAll(".error")
            .forEach(e => e.classList.remove("error"));

        const setErr = (selector, flag) => {
            if(flag) {
                document.querySelectorAll(selector)
                    .forEach(e => e.classList.add("error"));
            }
        };

        for(let b = 0; b < 9; b++) {
            setErr("#b" + b + " .cell", this.isErrorBox(b));
        }
        for(let r = 0; r < 9; r++) {
            setErr(".row" + r + "", this.isErrorRow(r));
        }
        for(let c = 0; c < 9; c++) {
            setErr(".col" + c, this.isErrorCol(c));
        }
    }
};

function count(array, value) {
    var count = 0;
    for(let i = 0; i < array.length; i++)
        if(array[i] === value)
            count++;
    return count;
}
