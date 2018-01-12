import { NgModule } from '@angular/core';

import { TopNavigationMenuModule } from './top navigation menu/top_nav_menu.module';
import { SideMenuModule } from "./side-menu/side-menu.module";
import { FooterModule } from "./footer/footer.module";
import { QuickActionsMenuModule } from './quick-actions-menu/quick-actions-menu.module';
import { LandingPageModule } from './landing page/landing-page.module';
import { NoContentModule } from './no-content/no-content.module';
import { BrowserModule } from '@angular/platform-browser';

import * as moment from 'moment';

@NgModule({
    imports: [
        BrowserModule,

        TopNavigationMenuModule,
        SideMenuModule,
        FooterModule,
        QuickActionsMenuModule,
        LandingPageModule,
        NoContentModule
    ],
    exports: [
        TopNavigationMenuModule,
        SideMenuModule,
        FooterModule,
        QuickActionsMenuModule,
        LandingPageModule,
        NoContentModule
    ]
})
export class LayoutModule {
}
