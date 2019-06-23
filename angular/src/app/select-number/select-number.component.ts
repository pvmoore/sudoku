import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { SudokuService, SudokuEvent } from "../sudoku.service";
import { EventListener } from "../events";
import {InformationService} from "../information.service";

@Component({
  selector: 'select-number',
  templateUrl: './select-number.component.html',
  styleUrls: ['./select-number.component.css']
})
export class SelectNumberComponent implements OnInit, OnDestroy, EventListener<SudokuEvent> {

  constructor(private sudokuService:SudokuService,
              private infoService:InformationService) {}

  ngOnInit() {
    console.log("onInit() select-number");
    this.sudokuService.events.register(this);
  }
  ngOnDestroy() {
    this.sudokuService.events.unregister(this);
  } 
  // Handle SudokuService events
  onEvent(e:SudokuEvent, data:Object) {
    switch(e) {
      case SudokuEvent.CELL_SELECTED:
        this.show(data as number);
        break;
      case SudokuEvent.CELL_DESELECTED:
        this.hide();
        break;
    }
  }
  onSelectValue(e:Event) {
    const target = e.target as HTMLElement;
    const number = parseInt(target.innerText) || 0;
    if(number==0) return;

    this.sudokuService.updateCellValue(number);
  }
  onSelectScratch(e:Event) {
    const target = e.target as HTMLElement;
    const number = parseInt(target.innerText) || 0;
    if(number==0) return;

    this.sudokuService.updateCellScratch(number);
  }
  private show(pos:number) {
    // position the select-number element
    const ns = document.getElementById("select-number")!;
    ns.style.display = "grid";

    // hide values that don't make sense
    document.querySelectorAll(".lowlight")
            .forEach(e=>e.classList.remove("lowlight"));

    const scratch = this.sudokuService.board.get(pos).scratch;
    const values  = this.sudokuService.board.getBoxValues(this.sudokuService.board.getBoxIndex(pos));
    const uiSel = document.getElementById("selection")!;
    const uiScr = document.getElementById("scratch")!;
    for(let i=0; i<9; i++) {
        if(scratch.includes(i+1) || values.includes(i+1)) {
            uiScr.children[i].classList.add("lowlight");
        }
        if(values.includes(i+1)) {
            uiSel.children[i].classList.add("lowlight");
        }
    }
  }
  private hide() {
    const ns = document.getElementById("select-number")!;
    ns.style.display = "none";
  }

  /*
  private numberListener(e:Event) {

    const target = e.target as HTMLElement;
    const number = parseInt(target.innerText) || 0;
    if(number==0) return;
    const isScratch = "scratch"==(target.parentNode as HTMLElement).id;
    const i = sudoku.selectedCellIndex || 0;
    const c = sudoku.board.get(i);

    if(isScratch) {
        // Toggle the scratch number
        if(c.scratch.includes(number)) {
            c.scratch.remove(number);
        } else {
            c.scratch.push(number);
        }
        c.scratch.sort();
    } else {
        // Set the cell number
        if(c.isUser) {
            if(c.value==number) {
                // remove the set value
                c.value = 0;
            } else {
                c.value = number;
                c.scratch = [];

                // remove scratch from other affected cells
                this.board.getAffectedCells(i)
                          .forEach((v,i)=>{
                              if(v.scratch.remove(number)) {
                                  this.updateCellUI(v.index);
                              }
                          });
            }
            this.setErrorCells();
        }
    }
    this.updateCellUI(i);
    this.hideNumberSelector();
    this.board.save();
  }
  */
}
