import { NgModule } from '@angular/core';

import { TopNavigaitonMenuComponent } from './top_nav_menu.component';
import { LoginAreaComponent } from './login area/login-area.component';

import { BrowserModule } from '@angular/platform-browser';

import * as moment from 'moment';

@NgModule({
    declarations: [
        TopNavigaitonMenuComponent,        
        LoginAreaComponent
    ],
    imports: [
        BrowserModule
    ],
    exports: [ 
        TopNavigaitonMenuComponent,
        LoginAreaComponent
    ]
})
export class TopNavigationMenuModule {
}
