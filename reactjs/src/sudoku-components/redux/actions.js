
export const NEW_GAME = "NEW_GAME";
export const SET_SELECTED_CELL = "SET_SELECTED_CELL";
export const SET_VALUE = "SET_VALUE";
export const SET_SCRATCH = "SET_SCRATCH";

export function newGame() {
    return {
        type: NEW_GAME,
        payload: {}
    }
}
export function setSelectedCell(pos) {
    return {
        type: SET_SELECTED_CELL,
        payload: { pos }
    }
}
export function setValue(pos, value) {
    return {
        type: SET_VALUE,
        payload: { pos, value }
    }
}
export function setScratch(pos, scratch) {
    return {
        type: SET_SCRATCH,
        payload: { pos, scratch }
    }
}
