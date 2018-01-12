import { NgModule, TemplateRef } from '@angular/core';
import { APP_RESOLVER_PROVIDERS } from './app.resolver';
import { AppState } from './app.service';
import { AppComponent } from './app.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ModalModule } from 'ng2-bootstrap';
import { AlertModule } from 'ng2-bootstrap/ng2-bootstrap';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { ProjectAssignmentModule } from './project assignment/project-assignment.module';
import { CoreModule } from './core/core.module';
import { LayoutModule } from './layout/layout.module';
import { AuthModule } from './common/authorization/auth.module';


import { ROUTES } from './app.routes';

import * as moment from 'moment';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: false }),

    ProjectAssignmentModule,
    CoreModule,
    LayoutModule,
    AuthModule
  ]
})

export class AppModule { }