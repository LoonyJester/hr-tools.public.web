import { NgModule } from '@angular/core';

import { PageHeaderComponent } from './page-header.component';
import { BrowserModule } from '@angular/platform-browser';

import * as moment from 'moment';

@NgModule({
  declarations: [
    PageHeaderComponent,
  ],
  imports: [
    BrowserModule
  ],
  exports: [
    PageHeaderComponent
  ]
})
export class PageHeaderModule {
}
