export {Board3x3x9};

class Board3x3x9 {
    constructor() {
        this.board = new Array(9*9);
        this.board.fill({});
        this.clear();
    }
    load() {
        const game = localStorage.getItem("currentGame");
        this.board = JSON.parse(game);
    }
    save() {
        localStorage.setItem("currentGame", JSON.stringify(this.board));
    }
    clear() {
        this.board.forEach((v,i)=> {
            this.board[i] = {
                value:   0,
                isUser:  false,
                scratch: []
            };
        });
    }
    get(pos) {
        console.assert(pos>=0 && pos<9*9);
        return this.board[pos];
    }
    getBoxIndex(pos) {
        const r = Math.trunc(pos/27) * 3;
        const c = Math.trunc(pos%9/3);
        return r + c;
    }
    getBoxValues(box) {
        console.assert(box>=0 && box<9);

        const start  = Math.trunc(box/3)*27 + Math.trunc(box%3)*3;
        const values = [];

        for(let x=0; x<3; x++) {
            for(let y=0; y<3; y++) {
                const index = start+x+y*9;
                const value = this.board[index].value;
                if(value!=0) {
                    values.push(value);
                }
            }
        }
        return values;
    }
    getRowValues(row) {
        console.assert(row>=0 && row<9);

        const values = [];
        for(let i=0; i<9; i++) {
            const index = row*9+i;
            const value = this.get(index);
            if(value.value!=0) values.push(value.value);
        }
        return values;
    }
    getColValues(col) {
        console.assert(col>=0 && col<9);

        const values = [];
        for(let i=0; i<9; i++) {
            const index = col + i*9;
            const value = this.get(index);
            if(value.value!=0) values.push(value.value);
        }
        return values;
    }
    isErrorRow(r) {
        const rowValues = this.getRowValues(r);
        for(let i=1; i<=9; i++) {
            if(rowValues.count(i)>1) return true;
        }
        return false;
    }
    isErrorCol(c) {
        const colValues = this.getColValues(c);
        for(let i=1; i<=9; i++) {
            if(colValues.count(i)>1) return true;
        }
        return false;
    }
    isErrorBox(b) {
        const boxValues = this.getBoxValues(b);
        for(let i=1; i<=9; i++) {
            if(boxValues.count(i)>1) return true;
        }
        return false;
    }
}