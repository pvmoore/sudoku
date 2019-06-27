export { initWasm, newGame };

import { Wasm } from './wasm.js';

/*
wasm exports:
    void newGame();
    void continueGame();
    void cellClicked(int pos);
    void valueSelected(int value);
    void scratchSelected(int scratch);
    int* getBoardErrors();

called by wasm:
    jsCellUpdated(cellptr)
    jsCellSelected(cellptr)
    jsCellDeselected(cellptr)
    jsLog(ptr,len)
    jsSave(cellsptr)
*/

let wasm;

function initWasm() {
    wasm = new Wasm();

    if(!wasm.isSupported) {
        document.getElementById('info').innerHTML = ':( Web Assembly not available';
    } else {
        //const memory = new WebAssembly.Memory({initial:20, maximum:100});

        const importObject = {
            env: {
                //memory: memory,
                wasmMemorySize: () => wasm.memory.buffer.byteLength,
                wasmMemoryGrow: (pages) => wasm.memory.grow(pages),

                jsCellUpdated: cellUpdated,
                jsCellSelected: cellSelected,
                jsCellDeselected: cellDeselected,
                jsLog: log,
                jsSave: save
            }
        };

        wasm.init('sudoku.wasm', importObject, false).then(() => {
            wasmLoaded();
        });
    }
}

function wasmLoaded() {
    /**Add board listener */
    const cellClicked = (pos, event) => {
        wasm.instance.exports.cellClicked(pos);
    };

    for(let i = 0; i < 9 * 9; i++) {
        const uiCell = getUICell(i);
        uiCell.addEventListener('mousedown', (e) => cellClicked(i, e));
    }

    /** Add select-number listener */
    const selectNumber = document.getElementById('select-number');
    selectNumber.addEventListener('mousedown', (e) => {
        const target = e.target;
        const number = parseInt(target.innerText) || 0;
        if(number == 0) return;

        const isScratch = 'scratch' == target.parentNode.id;

        if(isScratch) {
            wasm.instance.exports.scratchSelected(number);
        } else {
            wasm.instance.exports.valueSelected(number);
        }
    });

    /** Start or continue the game */

    //localStorage.removeItem('currentGame-wasm');

    const key = localStorage.getItem('currentGame-wasm');
    if(key) {
        const bytes = new TextEncoder('utf-8').encode(key);

        /** Allocate some heap space for the param */
        const ptr = wasm.instance.exports.malloc(bytes.byteLength);

        /** Write the bytes to mem */
        const buf = new Uint8Array(wasm.memory.buffer, ptr, bytes.byteLength);
        buf.set(bytes);

        wasm.instance.exports.continueGame(ptr, bytes.byteLength);
    } else {
        wasm.instance.exports.newGame();
    }
}
function newGame() {
    wasm.instance.exports.newGame();
}

/**
 * Functions called by wasm code.
 */
function cellUpdated(cellptr) {
    updateCellUI(getCell(cellptr));
}
function cellSelected(cellptr) {
    const cell = getCell(cellptr);
    const uiCell = getUICell(cell.index);

    uiCell.classList.add('selected');
    showSelectNumber(cell);

    //console.log(`cellSelected(${cell.index} ${JSON.stringify(cell)})`);
}
function cellDeselected(cellptr) {
    const cell = getCell(cellptr);
    const uiCell = getUICell(cell.index);

    uiCell.classList.remove('selected');
    hideSelectNumber();

    //console.log(`cellDeselected(${cell.index} ${JSON.stringify(cell)})`);
}
function log(ptr, len) {
    const str = wasm.getString(ptr, len);
    console.log(str);
}
function save(cellsptr) {
    const cells = getCells(cellsptr);
    localStorage.setItem('currentGame-wasm', JSON.stringify(cells));
    //console.log("save cells=" + JSON.stringify(cells));
}
// const Cell = {
//     index,          // cell index
//     value,          // 0 to 9 (0==unset)
//     isUser,         // true if placed by user
//     scratch         // Array(9)
// };
function getCell(ptr) {
    //console.log("jsCell ptr=" + ptr);
    const cellSize = 4 * 13;
    const array = wasm.getI32Array(ptr, cellSize);
    return arrayToCell(array, 0);
}
function getCells(ptr) {
    //console.log("getCells ptr="+ptr);
    const cellSize = 4 * 13;
    const array = wasm.getI32Array(ptr, cellSize * 9 * 9);
    const cells = [];
    for(let i = 0; i < 9 * 9; i++) {
        const cell = arrayToCell(array, i * cellSize / 4);
        cells.push(cell);
    }
    //cells[0].scratch = { "0": 1 };
    //console.log("scratch is array = " + Array.isArray(cells[0].scratch));
    //console.log("cells = "+JSON.stringify(cells,null," "));
    return cells;
}
function arrayToCell(array, offset) {
    // Convert Int32Array scratch to a normal Array
    let so = array.slice(4 + offset, 4 + offset + 9).map((v, i) => (v == 1 ? i + 1 : null)).filter((v) => v);
    if(so.length > 0) {
        so = Array.from(so);
    } else {
        so = [];
    }
    const cell = {
        index: array[0 + offset],
        box: array[1 + offset],
        value: array[2 + offset],
        isUser: array[3 + offset],
        scratch: so//array.slice(4 + offset, 4 + offset + 9).map((v, i) => (v == 1 ? i + 1 : null)).filter((v) => v)
    };
    //console.log("cell=" + JSON.stringify(cell));
    return cell;
}
function getUIBox(pos) {
    console.assert(pos >= 0 && pos < 82);

    const uiBoard = document.getElementById('board');
    const r = Math.trunc(pos / (9 * 3));
    const c = Math.trunc((pos % 9) / 3);
    const box = r * 3 + c;
    return uiBoard.children[box];
}
function getUICell(pos) {
    const uiBox = getUIBox(pos);
    const r = Math.trunc((pos % 27) / 9);
    const c = Math.trunc(pos % 3);
    const cell = c + r * 3;
    return uiBox.children[cell];
}
function updateCellUI(cell) {
    //console.log("updateCellUI: " + JSON.stringify(cell));
    const pos = cell.index;
    const uiCell = getUICell(pos);
    const uiValue = uiCell.firstElementChild;
    const uiScratch = uiCell.children[1];

    /** Set value */
    if(cell.isUser) {
        uiValue.classList.add('userPlaced');
    } else {
        uiValue.classList.remove('userPlaced');
    }
    uiValue.innerText = cell.value == 0 ? ' ' : cell.value.toString();

    /** Set scratch */
    const scratch = cell.scratch;
    scratch.sort();
    uiScratch.innerText = scratch.toString().replace(/,/g, '');

    setErrorCells();
}
function setErrorCells() {
    /** Remove all errors */
    document.querySelectorAll('.error').forEach((e) => e.classList.remove('error'));

    const setErr = (selector, flag) => {
        if(flag) {
            document.querySelectorAll(selector).forEach((e) => e.classList.add('error'));
        }
    };

    /** Get errors calculated by wasm code */
    const ptr = wasm.instance.exports.getBoardErrors();
    const errors = wasm.getI32Array(ptr, 4 * (9 + 9 + 9));

    const boxes = errors.slice(0, 9);
    const cols = errors.slice(9, 18);
    const rows = errors.slice(18);

    //console.log("Board errors: boxes="+boxes+" cols="+cols+" rows="+rows);

    /** Set error styles */
    for(let b = 0; b < 9; b++) {
        setErr('#b' + b + ' .cell', boxes[b]);
    }
    // rows
    for(let r = 0; r < 9; r++) {
        setErr('.row' + r + '', rows[r]);
    }
    // cols
    for(let c = 0; c < 9; c++) {
        setErr('.col' + c, cols[c]);
    }
}
function showSelectNumber(cell) {
    /**  position the select-number element */
    const ns = document.getElementById('select-number');
    ns.style.display = 'grid';

    /** hide values that don't make sense */

    document.querySelectorAll('.lowlight').forEach((e) => e.classList.remove('lowlight'));

    const scratch = cell.scratch;
    const cells = getCells(wasm.instance.exports.getBoard());

    const values = cells.filter((c) => c.box == cell.box).filter((c) => c.value != 0).map((c) => c.value);

    const uiSel = document.getElementById('selection');
    const uiScr = document.getElementById('scratch');
    for(let i = 0; i < 9; i++) {
        if(scratch[i + 1] || values.includes(i + 1)) {
            uiScr.children[i].classList.add('lowlight');
        }
        if(values.includes(i + 1)) {
            uiSel.children[i].classList.add('lowlight');
        }
    }
}
function hideSelectNumber() {
    const ns = document.getElementById('select-number');
    ns.style.display = 'none';
}
