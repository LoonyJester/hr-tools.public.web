import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './layout/landing page/landing-page.component';
import { EmployeeListComponent } from "./core/employee/employee-list.component";
import { ProjectAssignmentListComponent } from "./project assignment/assignment/project-assignment-list.component";
import { LoginComponent } from "./common/authorization/login/login.component";
import { NoContentComponent } from './layout/no-content/no-content.component';
import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'EmployeeList', component: EmployeeListComponent },
  { path: 'ProjectAssignment', component: ProjectAssignmentListComponent },
  { path: 'Login', component: LoginComponent },
  { path: '**', component: NoContentComponent },
];