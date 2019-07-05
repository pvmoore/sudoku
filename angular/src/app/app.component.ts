import { SudokuService } from './sudoku.service';
import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import * as util from "./util";
import { InformationService } from "./information.service";

@Component({
  selector: 'sudoku',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None  // disable shadow dom
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Sudoku (Angular 8)';

  constructor(private sudokuService: SudokuService,
    private infoService: InformationService) {
    // Include prototypes from util.ts
    util.includePrototypes();
  }

  ngOnInit() {

  }
  ngAfterViewInit() {
    console.log("ngAfterViewInit()");

    const game = localStorage.getItem("currentGame");
    if (game) {
      this.sudokuService.continuePuzzle();
    } else {
      this.sudokuService.newPuzzle();
    }
  }
}
