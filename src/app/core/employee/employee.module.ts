import { NgModule } from '@angular/core';

import { EmployeeComponent } from './employee.component';
import { EmployeeListComponent } from './employee-list.component';
import { EmployeeDetailsModalComponent } from './modals/details/details.component';
import { SafePipe } from '../../app.component';

import { BrowserModule } from '@angular/platform-browser';
import { Ng2BootstrapModule } from 'ng2-bootstrap';
import { PaginationModule } from 'ng2-bootstrap/ng2-bootstrap';
import { PageHeaderModule } from "../../common/page header/page-header.module";


import * as moment from 'moment';

@NgModule({
    declarations: [
        EmployeeComponent,
        EmployeeListComponent,
        EmployeeDetailsModalComponent,
        SafePipe
    ],
    imports: [
        BrowserModule,
        Ng2BootstrapModule,
        PaginationModule,
        PageHeaderModule
    ]
})
export class EmployeeModule {
}
