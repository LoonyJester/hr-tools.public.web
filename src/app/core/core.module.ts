import { NgModule } from '@angular/core';
import { EmployeeModule } from "./employee/employee.module";

import * as moment from 'moment';

@NgModule({
  imports: [
    EmployeeModule
  ]
})

export class CoreModule {
}
