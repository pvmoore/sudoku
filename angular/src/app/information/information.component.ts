import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
  encapsulation: ViewEncapsulation.None   // disable shadow dom
})
export class InformationComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }
}
