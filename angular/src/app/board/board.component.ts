import { Component, OnInit, OnDestroy, ViewEncapsulation, Input } from '@angular/core';
import { Cell } from "../board";
import { SudokuService, SudokuEvent } from "../sudoku.service";
import { EventListener } from "../events";
import { InformationService } from "../information.service";

@Component({
  selector: 'board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  encapsulation: ViewEncapsulation.None  // disable shadow dom
})
export class BoardComponent implements OnInit, OnDestroy, EventListener<SudokuEvent> {
  private listeners: Object;
  private selectedCell:HTMLElement = null; 

  constructor(private sudokuService:SudokuService, 
              private infoService:InformationService) {}

  ngOnInit() {
    console.log("onInit() board");
    this.sudokuService.events.register(this);
  }
  ngOnDestroy() {
    this.sudokuService.events.unregister(this);
  }  
  // Handle SudokuService events
  onEvent(e:SudokuEvent, data:Object) {
    switch(e) {
      case SudokuEvent.BOARD_UPDATED:
          this.selectedCell = null;
          for(let i=0; i<81; i++) {
            this.updateCellUI(i);
          }
          break;
      case SudokuEvent.CELL_UPDATED: {
          const cell = data as Cell;
          this.updateCellUI(cell.index);
          //console.log(`cell updated ${cell}`);
          break;
        }
      case SudokuEvent.CELL_SELECTED: {
          const pos = data as number;
          const cell = this.sudokuService.board.get(pos);
          const uiCell = this.getUICell(pos);
          uiCell.classList.add("selected");
          //console.log(`cell selected ${cell}`);
          break;
        }
      case SudokuEvent.CELL_DESELECTED: {
          const pos = data as number;
          const cell = this.sudokuService.board.get(pos);
          const uiCell = this.getUICell(pos);
          uiCell.classList.remove("selected");
          //console.log(`cell deselected ${pos}`);
          break;
        }
    }
  }
  boardClicked(e:Event) {
    //console.log("boardClicked");
    const target = e.target as HTMLElement;
    const parent = target.parentNode;

    // Get the cell element
    let uiCell = target;
    while(uiCell && !uiCell.classList.contains("cell")) {
      uiCell = uiCell.parentElement;
    }
    if(!uiCell) return;

    // Get the box index
    const box = +uiCell.parentElement.id.slice(1);

    // Get the row and col indexes
    let row = +Object.values(uiCell.classList).filter((e)=>e.match(/r\d/))[0].slice(1) - 1;
    let col = +Object.values(uiCell.classList).filter((e)=>e.match(/c\d/))[0].slice(1) - 1;
    let pos = Math.trunc(box/3)*27 +
              Math.trunc(box%3)*3 + 
              row*9 +
              col;
    //console.log(`box=${box} row=${row} col=${col} pos=${pos}`);

    const isUser = this.sudokuService.board.get(pos).isUser;

    if(isUser) {
      this.sudokuService.cellSelected(pos);
    }
  }
  private setErrorCells() {
    // remove all errors
    document.querySelectorAll(".error")
            .forEach(e=>e.classList.remove("error"));

    const setErr = (selector:string,flag:boolean) => {
        if(flag) {
            document.querySelectorAll(selector)
                    .forEach(e=>e.classList.add("error"));
        }
    };
    // boxes
    for(let b=0; b<9; b++) {
        setErr("#b"+b+" .cell", this.sudokuService.board.isErrorBox(b));
    }
    // rows
    for(let r=0; r<9; r++) {
        setErr(".row"+r+"", this.sudokuService.board.isErrorRow(r));
    }
    // cols
    for(let c=0; c<9; c++) {
        setErr(".col"+c, this.sudokuService.board.isErrorCol(c));
    }
  }
  private updateCellUI(pos:number) {
    const uiCell = this.getUICell(pos) as HTMLElement;
    const uiValue = uiCell.firstElementChild as HTMLElement;
    const uiScratch = uiCell.children[1] as HTMLElement;
    const c = this.sudokuService.board.get(pos);

    if(c.isUser) { 
      uiValue.classList.add("userPlaced"); 
    } else {
      uiValue.classList.remove("userPlaced"); 
    }
    uiValue.innerText = c.value==0 ? " " : c.value.toString();

    c.scratch.sort();
    uiScratch.innerText = c.scratch.toString().replace(/,/g, "");

    this.setErrorCells();
  }
  private getUIBox(pos:number) {
    console.assert(pos>=0 && pos < 82);

    const uiBoard = document.getElementById("board");
    const r   = Math.trunc(pos/(9*3));
    const c   = Math.trunc(pos%9/3);
    const box = r*3+c;
    return uiBoard!.children[box];
  }
  private getUICell(boardPos:number) {
    const uiBox = this.getUIBox(boardPos);
    const r     = Math.trunc(boardPos%27/9);
    const c     = Math.trunc(boardPos%3);
    const cell  = c+r*3;
    return uiBox.children[cell];
  }
}
