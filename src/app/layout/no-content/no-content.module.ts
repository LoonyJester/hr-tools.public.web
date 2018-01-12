import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoContentComponent } from "./no-content.component";

@NgModule({
  declarations: [
    NoContentComponent
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    NoContentComponent
  ]
})
export class NoContentModule {
}
