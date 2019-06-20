export { Board, Cell };

interface Cell {
    index:number;           // cell index
    value:number;           // 0 to 9 (0==unset)
    isUser:boolean;         // true if placed by user
    scratch:Array<number>;
}

abstract class Board {
    board:Array<Cell> = [];

    clear() {
        this.board.forEach((v,i)=> {
            this.board[i] = {
                index:   i,
                value:   0,
                isUser:  false,
                scratch: []
            } as Cell;
        });
    }
    get(pos:number) {
        return this.board[pos];
    }
    load() {
        const game = localStorage.getItem("currentGame")!;
        this.board = JSON.parse(game);
    }
    save() {
        localStorage.setItem("currentGame", JSON.stringify(this.board));
    }
    abstract isErrorBox(b:number):boolean;
    abstract isErrorRow(r:number):boolean;
    abstract isErrorCol(c:number):boolean;
    abstract getBoxValues(b:number):number[];
    abstract getRowValues(r:number):number[];
    abstract getColValues(c:number):number[];
    abstract getBoxIndex(pos:number):number;
    abstract getAffectedCells(pos:number):Array<Cell>;
}