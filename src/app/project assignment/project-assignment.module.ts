import { NgModule } from '@angular/core';

import { AssignmentModule } from "./assignment/assignment.module";

import { UserService } from '../common/authorization/services/user.service';
import { UrlHelper } from "../common/company/urlHelper";
import { CompanyHelper } from "../common/company/companyHelper";
import { TooltipModule } from 'ng2-bootstrap';

import * as moment from 'moment';

@NgModule({
  imports: [
    AssignmentModule,
    TooltipModule
  ],
  providers: [
    UserService,
    UrlHelper,
    CompanyHelper
  ]
})
export class ProjectAssignmentModule {
}
