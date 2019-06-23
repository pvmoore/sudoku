import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SudokuService } from "../sudoku.service";
import { InformationService } from '../information.service';

@Component({
  selector: 'controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
  encapsulation: ViewEncapsulation.None   // disable shadow dom
})
export class ControlsComponent implements OnInit {

  constructor(private sudokuService:SudokuService,
              private infoService:InformationService) {}

  ngOnInit() {

  }
  newGame() {
    this.sudokuService.newPuzzle();
  }
}
