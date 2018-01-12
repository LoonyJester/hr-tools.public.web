import { Component, Input, ViewChild, OnInit } from '@angular/core';
import { Headers } from '@angular/http';
import { ProjectAssignmentService } from './services/project-assignment.service';
import { EmployeeComponent } from './employee.component';
import { ProjectAssignment } from './project-assignment';
import { ProjectAssignmentFilter } from './project-assignment-filter';
import { ProjectAssignmentSettings } from './project-assignment-settings';
import { ProjectAssignmentGridItem } from './project-assignment-grid-item';
import { AlertType } from "../../common/alerts/alertType";
import { PaginationComponent } from 'ng2-bootstrap/ng2-bootstrap';
import { UrlHelper } from "../../common/company/urlHelper";
import { AddEditProjectAssignmentModalComponent } from "./modals/addEdit/addEditProjectAssignmentModal.component";
import { PageHeaderComponent } from '../../common/page header/page-header.component';
import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { DeleteConfirmationModalComponent } from '../../common/modals/delete confirmation/delete-confirmation.component';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ng2-bootstrap';
import { JobTitle } from "../../core/common/models/job-title";
import { Technology } from "../../core/common/models/technology";
import { Department } from "../common/department";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'project-assignment-list',
    templateUrl: 'project-assignment-list.template.html',
    styleUrls: ['project-assignment-list.style.css'],
    providers: [ProjectAssignmentService, ProjectAssignmentFilter, UrlHelper]
})

export class ProjectAssignmentListComponent {
    @ViewChild(AddEditProjectAssignmentModalComponent) addEditModal: AddEditProjectAssignmentModalComponent
    @ViewChild(DeleteConfirmationModalComponent) confirmDeleteModal: DeleteConfirmationModalComponent

    public projectAssignments: Array<ProjectAssignmentGridItem>;
    public gridSettings: ProjectAssignmentSettings;
    public columns: Array<any>;    
    public filters: ProjectAssignmentFilter = new ProjectAssignmentFilter();

    public alerts: Array<any> = [];
    public fullNameAutoCompleteDataSource: Observable<any>;
    public projectAutoCompleteDataSource: Observable<any>;
    public isLoading: boolean = true;

    constructor(private _projectAssignmentService: ProjectAssignmentService,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        this.resetFilters();
        this.gridSettings = new ProjectAssignmentSettings(0, 1, 15, "EmployeeFullName", false, "", this.filters);

        this.projectAssignments = this.getAll(this.gridSettings);
        this.columns = this.getColumns();

        this.initFilters();
    }     

    public resetFilters(): void {
        this.filters.fullName = "";
        this.filters.jobTitle = "";
        this.filters.technology = "";
        this.filters.project = "";
        this.filters.department = "";
        this.filters.showOldAssignments = false;
        this.filters.showOldDeactivatedProjects = false;
    }

    private getColumns(): Array<any> {
        return [
            { title: 'Full Name', name: 'employeeFullName', className: ["width15Perc"], sort: 'desc' },
            { title: 'Job Title', name: 'employeeJobTitle', className: "width10Perc", sort: ''},
            { title: 'Technology', name: 'employeeTechnology', className: "width10Perc", sort: '' },
            { title: 'Project', name: 'projectName', className: "width15Perc", sort: '' },
            { title: 'Department', name: 'departmentName', className: "width15Perc", sort: '' },
            { title: 'Start Date', name: 'startDateToDisplay', className: "width10Perc", sort: '' },
            { title: 'End Date', name: 'endDateToDisplay', className: "width10Perc", sort: '' },
            { title: 'Assigned For (%)', name: 'assignedForInPersents', className: "width5Perc", sort: '' },
            { title: 'Billable For (%)', name: 'billableForInPersents', className: "width5Perc", sort: '' },
            { title: 'Edit', name: 'edit', className: "width5Perc", sort: false },
            { title: 'Delete', name: '_delete', className: "width5Perc", sort: false }
        ];
    }

    private initFilters(): void {
        this._projectAssignmentService.getJobTitleList()
            .subscribe(response => {
                this.filters.jobTitleList = response;
            }
            , error => this.handleError(error));

        this._projectAssignmentService.getTechnologyList()
            .subscribe(response => {
                this.filters.technologyList = response;
            }
            , error => this.handleError(error));

        this._projectAssignmentService.getDepartmentList()
            .subscribe(response => {
                this.filters.departmentList = response;
            }
            , error => this.handleError(error));

        this.fullNameAutoCompleteDataSource = Observable.create((observer: any) => {
            // Runs on every search
            observer.next(this.filters.fullName);
        }).mergeMap((token: string) => this._projectAssignmentService.getEmployeesByNameAutocomplete(this.filters.fullName));

        this.projectAutoCompleteDataSource = Observable.create((observer: any) => {
            // Runs on every search
            observer.next(this.filters.project);
        }).mergeMap((token: string) => this._projectAssignmentService.getProjectsByNameAutocomplete(this.filters.project, true, true));
    }        

    public onFullNameFilterSelected(event: any): void {
        this.filters.employeeId = event.item.employeeId;
    }

    public onProjectFilterSelected(event: any): void {
        this.filters.projectId = event.item.id;
    }

    public assign(): void {
        this.addEditModal.showChildModal("Add", this.filters.departmentList, new ProjectAssignment());
    }    

    public onDelete(row: ProjectAssignmentGridItem): boolean {
        this.isLoading = true;
        var wasDeleted;

        this._projectAssignmentService.delete(row.id)
            .subscribe(
            response => {
                wasDeleted = response;

                if (wasDeleted) {
                    this.getAll(this.gridSettings);
                    this.showResult(wasDeleted, "Assignment was successfully deleted", AlertType.Success);
                } else {
                    this.showResult(wasDeleted, "Assignment was not deleted", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        //this.getAll(this.gridSettings);

        return wasDeleted;
    }

    public onCellClicked(event: any): void {
        if (event.column == "edit") {
            this._edit(event.row);
        } else if (event.column == "_delete") {
            this._delete(event.row)
        }
    }

    private _edit(row: ProjectAssignment): void {
        let rowCopy = <ProjectAssignment>JSON.parse(JSON.stringify(row));

        this.addEditModal.showChildModal("Edit", this.filters.departmentList, rowCopy);
    }

    private _delete(row: ProjectAssignmentGridItem): void {
        this.confirmDeleteModal.show(row);
    }

    public onGridStateChanged(event: any): void {
        this.isLoading = true;

        this.gridSettings.currentPage = event.currentPage;
        this.gridSettings.sortColumnName = event.sortColumnName;
        this.gridSettings.isDescending = event.isDescending;

        this.getAll(this.gridSettings);
    }

    public search(searchKeyword: string, filters: ProjectAssignmentFilter): void {
        this.isLoading = true;

        this.gridSettings.searchKeyword = searchKeyword;
        this.gridSettings.projectAssignmentFilter = filters;

        this.getAll(this.gridSettings);
    }   

    public onSaved(projectAssignment: ProjectAssignment): void {
        this.isLoading = true;

        if (projectAssignment.id) {
            this.update(projectAssignment);
        } else {
            this.create(projectAssignment);
        }
    }

    private update(projectAssignment: ProjectAssignment): void {
        let wasUpdated: boolean;

        this._projectAssignmentService.update(projectAssignment)
            .subscribe(
            response => {
                wasUpdated = response;

                if (wasUpdated) {
                    this.getAll(this.gridSettings);
                    this.showResult(wasUpdated, "Project Assignment was successfully updated", AlertType.Success);
                } else {
                    this.showResult(wasUpdated, "Project Assignment was not upated", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );
    }

    private create(projectAssignment: ProjectAssignment): boolean {
        var wasCreated: boolean = false;

        this._projectAssignmentService.create(projectAssignment)
            .subscribe(
            response => {
                wasCreated = response;

                if (wasCreated) {
                    this.getAll(this.gridSettings);
                    this.showResult(wasCreated, "Project Assignment was successfully created", AlertType.Success);
                } else {
                    this.showResult(wasCreated, "Project Assignment was not created", AlertType.Error);
                }
            },
            error => this.handleError(error)
            );

        return wasCreated;
    }

    private getAll(gridSettings: ProjectAssignmentSettings): Array<ProjectAssignmentGridItem> {
        this._projectAssignmentService.getAll(gridSettings)
            .subscribe(response => {
                this.projectAssignments = response.data.map(this.mapProjectAssignmentsToGridItem);
                this.gridSettings.totalCount = response.totalCount;
                this.isLoading = false;                  
            }
            , error => this.handleError(error));

        return this.projectAssignments;
    }

    private mapProjectAssignmentsToGridItem(employee: ProjectAssignment): ProjectAssignmentGridItem {
        let result: ProjectAssignmentGridItem = new ProjectAssignmentGridItem(employee);

        result.setClassNames();

        result.edit = '<i class="fa fa-pencil-square-o"></i>';
        result._delete = '<i class="fa fa-times"></i>';

        return result;
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error._body) {
            let errorBody = JSON.parse(error._body);
            if(errorBody.Message){
                errorMessage = errorBody.Message;
            }else{
                errorMessage = errorBody;
            }  
        }

        if (error.status == 401) {
            errorMessage = "You don't have permissions to make a request. Please, contact your administrator.";
            this._authService.handleUnauhorizedError();
        }

        this.showResult(false, errorMessage, AlertType.Error);
        console.log(error);
    }

    private showResult(wasOperationSucceed: boolean, message: string, type: string): void {
        this.isLoading = false;

        if (!this.alerts.some(x => x.msg == message)) {
            this.alerts.push({
                type: type,
                msg: message,
                timeout: 5000
            });
        }
    }
}