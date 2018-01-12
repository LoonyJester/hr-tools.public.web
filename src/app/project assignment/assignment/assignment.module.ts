import { NgModule } from '@angular/core';
import { Http, Headers, URLSearchParams, HttpModule } from '@angular/http';

import { ProjectAssignmentListComponent } from './project-assignment-list.component';
import { AddEditProjectAssignmentModalComponent } from './modals/addEdit/addEditProjectAssignmentModal.component';

import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { SelectModule } from 'ng2-select';
import { DeleteConfirmationModule } from '../../common/modals/delete confirmation/delete-confirmation.module';
import { GridModule } from '../../common/grid/grid.module';
import { PageHeaderModule } from "../../common/page header/page-header.module";
import { TypeaheadModule } from 'ng2-bootstrap';

import * as moment from 'moment';

@NgModule({
  declarations: [
    ProjectAssignmentListComponent,
    AddEditProjectAssignmentModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    Ng2BootstrapModule,
    PaginationModule,
    SelectModule,
    DeleteConfirmationModule,
    GridModule,
    PageHeaderModule,
    TypeaheadModule,
    HttpModule
  ]
})
export class AssignmentModule {
}
