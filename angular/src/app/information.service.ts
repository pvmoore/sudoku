import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InformationService {

  constructor() { }

  clear() {
    const ele = this.getTA();
    ele.value = "";
  }
  write(text:string) {
    const ele = this.getTA();
    ele.append(text + "\n");
 
  }
  private getTA() : HTMLTextAreaElement {
    const div = document.getElementById("information");
    const ta = div.querySelector("textarea");
    return ta;
  }
}
