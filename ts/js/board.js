export { Board };
class Board {
    constructor() {
        this.board = [];
    }
    clear() {
        this.board.forEach((v, i) => {
            this.board[i] = {
                index: i,
                value: 0,
                isUser: false,
                scratch: []
            };
        });
    }
    get(pos) {
        return this.board[pos];
    }
    load() {
        const game = localStorage.getItem("currentGame");
        this.board = JSON.parse(game);
    }
    save() {
        localStorage.setItem("currentGame", JSON.stringify(this.board));
    }
}
