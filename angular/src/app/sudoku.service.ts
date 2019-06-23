//import { SudokuService } from './sudoku.service';
import { Injectable } from '@angular/core';
import { Board, Cell } from './board';
import { Board3x3x9 } from './board3x3x9';
import { Events } from "./events";
import { InformationService } from './information.service';

export {SudokuEvent, SudokuService};

enum SudokuEvent {
    BOARD_UPDATED,
    CELL_UPDATED, 
    CELL_SELECTED,
    CELL_DESELECTED
}

@Injectable({
  providedIn: 'root'
})
class SudokuService {
  private _board:Board;
  private _selectedCellIndex:number = null;
  private _events:Events<SudokuEvent> = new Events<SudokuEvent>();

  get events() { return this._events; }
  get board() { return this._board; }

  constructor(private infoService:InformationService) {
    this._board = new Board3x3x9();
  }

  newPuzzle() {
    this.infoService.write("New puzzle");
    this._selectedCellIndex = null;
    [
      0,2,8, 0,7,0, 0,3,1,
      0,0,7, 0,0,5, 8,0,0,
      6,0,0, 2,0,0, 0,0,0,

      0,0,0, 1,0,7, 0,0,5,
      0,1,2, 0,0,0, 9,7,0,
      7,0,0, 4,0,3, 0,0,0,

      0,0,0, 0,0,2, 0,0,6,
      0,0,4, 5,0,0, 7,0,0,
      5,3,0, 0,6,0, 2,4,0
  ].forEach((v,i)=>{
      const c = this.board.get(i);
      c.value = v;
      c.isUser = v==0;
      c.scratch = [];
      this._events.fire(SudokuEvent.CELL_UPDATED, c);
    });
    this.board.save();
    this._events.fire(SudokuEvent.BOARD_UPDATED, {});  
  }
  continuePuzzle() {
    this.infoService.write("Continuing puzzle");
    this._selectedCellIndex = null;
    this.board.load();
    this._events.fire(SudokuEvent.BOARD_UPDATED, {});  
  }
  cellSelected(pos:number) {
    if(this._selectedCellIndex==pos) {
      // deselect cell
      this._selectedCellIndex = null;
      this._events.fire(SudokuEvent.CELL_DESELECTED, pos);
    } else {
      this._selectedCellIndex = pos;
      this._events.fire(SudokuEvent.CELL_SELECTED, pos);
    }
  }
  updateCellValue(value:number) {
    console.assert(this._selectedCellIndex!==null);

    const i = this._selectedCellIndex;
    const c = this.board.get(i);

    //console.log(`updateCellValue value:${value} pos:${i} cell:${JSON.stringify(c)}`);

    // Set the cell number
    if(c.isUser) {
      if(c.value==value) {
          // remove the set value
          c.value = 0;
          this._events.fire(SudokuEvent.CELL_UPDATED, c);
      } else {
          c.value = value;
          c.scratch = [];

          //console.log(`affected cells:${this.board.getAffectedCells(i).map(e=>e.index)}`);

          // remove scratch from other affected cells
          this.board.getAffectedCells(i)
                    .forEach((c,i)=>{
                        if(c.scratch.remove(value)) {
                          this._events.fire(SudokuEvent.CELL_UPDATED, c);
                        }
                    });
      }
      this._events.fire(SudokuEvent.CELL_UPDATED, c);
      this._events.fire(SudokuEvent.CELL_DESELECTED, this._selectedCellIndex);
      this._selectedCellIndex = null;
      this._board.save();
    }
  }
  updateCellScratch(scratch:number) {
    console.assert(this._selectedCellIndex!==null);

    const i = this._selectedCellIndex;
    const c = this.board.get(i);

    //console.log(`updateCellValue scratch:${scratch} pos:${i} cell:${JSON.stringify(c)}`);

    // Toggle the scratch number
    if(c.scratch.includes(scratch)) {
        c.scratch.remove(scratch);
    } else {
        c.scratch.push(scratch);
    }
    c.scratch.sort();

    this._events.fire(SudokuEvent.CELL_UPDATED, c);
    this._events.fire(SudokuEvent.CELL_DESELECTED, this._selectedCellIndex);
    this._selectedCellIndex = null;
    this._board.save();
  }
}
