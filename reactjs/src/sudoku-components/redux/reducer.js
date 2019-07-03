import { NEW_GAME, SET_SELECTED_CELL, SET_VALUE, SET_SCRATCH } from "./actions";
import { continueOrCreatePuzzle, createPuzzle } from "./state";

export default function sudokuReducer(state = continueOrCreatePuzzle(), action) {
    // console.log("reducer.action.type = " + action.type + " payload = " + JSON.stringify(action.payload));

    switch(action.type) {
        case NEW_GAME:
            return createPuzzle(state);
        case SET_SELECTED_CELL: {
            return {
                ...state,
                selectedCell: action.payload.pos
            }
        }
        case SET_VALUE:
            return setValue(state, action.payload);
        case SET_SCRATCH:
            return setScratch(state, action.payload);
        default:
            console.assert("Unknown action type: " + action.type);
            break;
    }
    return state;
}

function setScratch(state, { pos, scratch }) {
    const newState = { ...state, cells: state.cells.slice(0) };

    if(newState.cells[pos].scratch.includes(scratch)) {
        newState.cells[pos].scratch.remove(scratch);
    } else {
        newState.cells[pos].scratch.push(scratch);
        newState.cells[pos].scratch.sort();
    }
    return newState;
}
function setValue(state, { pos, value }) {
    const newState = { ...state, cells: state.cells.slice(0) };

    if(newState.cells[pos].value !== value) {
        newState.cells[pos].value = value;
    } else {
        newState.cells[pos].value = 0;
    }
    newState.cells[pos].scratch = [];

    /** Remove scratch value from cells within the same box */
    newState.getAffectedCells(pos).forEach((c, i) => {
        c.scratch.remove(value);
    });

    newState.setErrors();
    return newState;
}

