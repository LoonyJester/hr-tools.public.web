import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LandingPageComponent } from "./landing-page.component";

@NgModule({
  declarations: [
    LandingPageComponent
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    LandingPageComponent
  ]
})
export class LandingPageModule {
}
