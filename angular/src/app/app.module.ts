import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SelectNumberComponent } from './select-number/select-number.component';
import { BoardComponent } from './board/board.component';
import { ControlsComponent } from './controls/controls.component';
import { InformationComponent } from './information/information.component';

@NgModule({
  declarations: [
    AppComponent,
    SelectNumberComponent,
    BoardComponent,
    ControlsComponent,
    InformationComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
