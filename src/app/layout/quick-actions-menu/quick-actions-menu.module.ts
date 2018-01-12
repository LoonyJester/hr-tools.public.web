import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { QuickActionsMenuComponent } from "./quick-actions-menu.component";

@NgModule({
  declarations: [
    QuickActionsMenuComponent
  ],
  imports: [
    BrowserModule,
  ],
  exports: [
    QuickActionsMenuComponent
  ]
})
export class QuickActionsMenuModule {
}
