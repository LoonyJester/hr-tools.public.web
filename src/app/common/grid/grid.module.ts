import { NgModule } from '@angular/core';
import { GridComponent } from './grid.component';
import { BrowserModule } from '@angular/platform-browser';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Ng2TableModule } from "ng2-table";
import { TooltipModule } from 'ng2-bootstrap/ng2-bootstrap';

@NgModule({
  declarations: [
    GridComponent
  ],
  imports: [
    BrowserModule,
    PaginationModule,
    Ng2TableModule,
    TooltipModule
  ],
  exports: [
    GridComponent
  ]
})
export class GridModule {
}
