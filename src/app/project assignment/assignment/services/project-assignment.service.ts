import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../../common/employee';
import { ProjectAssignment } from '../project-assignment';
import { ProjectAssignmentFilter } from '../project-assignment-filter';
import { ProjectAssignmentSettings } from '../project-assignment-settings';
import { GridData } from '../../common/gridData';
import { AuthService } from '../../../common/authorization/services/auth.service';
import { UrlHelper } from "../../../common/company/urlHelper";
import { JobTitle } from "../../../core/common/models/job-title";
import { Technology } from "../../../core/common/models/technology";
import { Department } from "../../common/department";
import 'rxjs/add/observable/of';

@Injectable()
export class ProjectAssignmentService {
    private apiUrl;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.apiUrl = this._urlHelper.getApiUrl(host);
    }

    getAll(gridSettings: ProjectAssignmentSettings): Observable<GridData<ProjectAssignment>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        params.set('gridSettings',
            JSON.stringify({
                PagingSettings: {
                    CurrentPage: gridSettings.currentPage,
                    ItemsPerPage: gridSettings.itemsPerPage
                },
                SortingSettings: {
                    SortColumnName: gridSettings.sortColumnName,
                    IsDescending: gridSettings.isDescending
                },
                SearchKeyword: gridSettings.searchKeyword,
                ProjectAssignmentFilter: gridSettings.projectAssignmentFilter.isEmpty() ? {} :
                    {
                        EmployeeFullName: gridSettings.projectAssignmentFilter.fullName,
                        EmployeeJobTitle: gridSettings.projectAssignmentFilter.jobTitle,
                        EmployeeTechnology: gridSettings.projectAssignmentFilter.technology,
                        ProjectName: gridSettings.projectAssignmentFilter.project,
                        DepartmentName: gridSettings.projectAssignmentFilter.department,
                        ShowOldAssignments: gridSettings.projectAssignmentFilter.showOldAssignments,
                        ShowOldDeactivatedProjects: gridSettings.projectAssignmentFilter.showOldDeactivatedProjects
                    }
            }));

        return this._http.get(this.apiUrl + 'Api/GetAllProjectAssignments', {
            search: params,
            headers
        }).map(res => {
            let result = new GridData<ProjectAssignment>();
            let jsonRes = res.json();

            result.data = jsonRes.Data.map(this.mapBEToProjectAssignment);
            result.totalCount = jsonRes.TotalCount;

            return result;
        });
    }

    getEmployeesByNameAutocomplete(nameAutocomplete: string): Observable<Array<any>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        if (!nameAutocomplete || nameAutocomplete.length == 0) {
            return Observable.of(new Array<any>());
        }

        return this._http.get(this.apiUrl + 'Api/GetEmployeesByNameAutocomplete?nameAutocomplete=' + nameAutocomplete, {
            headers
        }).map(res => {
            let result = new Array<any>();
            let jsonRes = res.json();

            if (jsonRes.length == 0) {
                return [];
            }

            result = jsonRes.map(this.mapBEToEmployee);

            return result;
        });
    }

    getProjectsByNameAutocomplete(nameAutocomplete: string, showDeactivated: boolean, showOld: boolean): Observable<Array<any>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        if (!nameAutocomplete || nameAutocomplete.length == 0) {
            return Observable.of(new Array<any>());
        }

        params.set('model',
            JSON.stringify({
                NameAutocomplete: nameAutocomplete,
                ShowDeactivated: showDeactivated,
                ShowOld: showOld
            }));

        return this._http.get(this.apiUrl + 'Api/GetProjectsByNameAutocomplete?nameAutocomplete=' + nameAutocomplete + "&showDeactivated=" + showDeactivated + "&showOld=" + showOld, {
            //search: params,
            headers
        }).map(res => {
            let result = new Array<ProjectAssignment>();
            let jsonRes = res.json();

            if (jsonRes.length == 0) {
                return [];
            }

            result = jsonRes.map((item) => {
                let result: any = {};

                result.id = item.Id;
                result.value = item.Name;

                return result;
            });

            return result;
        });
    }

    getJobTitleList(): Observable<Array<JobTitle>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        return this._http.get(this.apiUrl + 'Api/GetAllJobTitles', {
            headers
        }).map(res => res.json().map(this.mapBEToJobTitle));
    }

    private mapBEToJobTitle(jobTitle: any): JobTitle {
        let result: JobTitle = new JobTitle();

        result.Id = jobTitle.Id;
        result.Name = jobTitle.Name;

        return result;
    }

    getTechnologyList(): Observable<Array<Technology>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        return this._http.get(this.apiUrl + 'Api/GetAllTechnologies', {
            headers
        }).map(res => res.json().map(this.mapBEToTechnology));
    }

    private mapBEToTechnology(technology: any): Technology {
        let result: Technology = new Technology();

        result.Id = technology.Id;
        result.Name = technology.Name;

        return result;
    }

    getDepartmentList(): Observable<Array<Department>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        return this._http.get(this.apiUrl + 'Api/GetAllDepartments', {
            headers
        }).map(res => res.json().map(this.mapBEToDepartment));
    }

    private mapBEToDepartment(department: any): Department {
        let result: Department = new Department();

        result.id = department.Id;
        result.name = department.Name;

        return result;
    }

    create(projectAssignment: ProjectAssignment): Observable<boolean> {
        let beModel = this.mapProjectAssignmentToBE(projectAssignment);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.post(this.apiUrl + 'Api/CreateProjectAssignment', body, {
            headers: headers
        }).map(res => res.json());
    }

    update(projectAssignment: ProjectAssignment): Observable<boolean> {
        let beModel = this.mapProjectAssignmentToBE(projectAssignment);
        const body = JSON.stringify(beModel);
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json');

        return this._http.put(this.apiUrl + 'Api/UpdateProjectAssignment', body, {
            headers: headers
        }).map(res => res.json());
    }

    delete(id: number): Observable<boolean> {
        let headers: Headers = this._authService.getHeaders();
        headers.append('Content-Type', 'application/json; charset=utf-8');

        return this._http.delete(this.apiUrl + 'Api/DeleteProjectAssignment', {
            headers: headers,
            body: id
        }).map(res => res.json());
    }

    private mapBEToProjectAssignment(projectAssignment: any): ProjectAssignment {
        let result = new ProjectAssignment();
        
        result.id = projectAssignment.Id;
        result.employeeId = projectAssignment.Employee.EmployeeId;
        result.employeeFullName = projectAssignment.Employee.FullName;
        result.employeeJobTitle = projectAssignment.Employee.JobTitle;
        result.employeeTechnology = projectAssignment.Employee.Technology;
        result.projectId = projectAssignment.Project == null ? null : projectAssignment.Project.Id;
        result.projectName = projectAssignment.Project == null ? null : projectAssignment.Project.Name;
        result.departmentId = projectAssignment.Department.Id;
        result.departmentName = projectAssignment.Department.Name;
        result.startDate = projectAssignment.StartDate;
        result.endDate = projectAssignment.EndDate;
        result.assignedForInPersents = projectAssignment.AssignedForInPersents;
        result.billableForInPersents = projectAssignment.BillableForInPersents;
        result.assignedForInPersentsSum = projectAssignment.AssignedForInPersentsSum;
        result.billableForInPersentsSum = projectAssignment.BillableForInPersentsSum;

        return result;
    }

    private mapBEToEmployee(employee: any): any {
        let result: any = {};

        result.employeeId = employee.EmployeeId;
        result.employeeFullName = employee.FullName;
        result.employeeJobTitle = employee.JobTitle;
        result.employeeTechnology = employee.Technology;
        result.employeeStartDate = employee.StartDate;
        result.assignedForInPersentsSum = employee.AssignedForInPersentsSum;
        result.billableForInPersentsSum = employee.BillableForInPersentsSum;

        return result;
    }

    private mapProjectAssignmentToBE(projectAssignment: ProjectAssignment): any {
        let result: any = {};
        
        result.Id = projectAssignment.id;
        result.Employee = {
            EmployeeId: projectAssignment.employeeId,
            FullName: projectAssignment.employeeFullName,
            JobTitle: projectAssignment.employeeJobTitle,
            StartDate: projectAssignment.startDate
        };
        if (projectAssignment.projectId) {
            result.Project = {
                Id: projectAssignment.projectId,
                Name: projectAssignment.projectName
            }
        }

        result.Department = {
            Id: projectAssignment.departmentId,
            Name: projectAssignment.departmentName
        };
        result.StartDate = projectAssignment.startDate;
        result.EndDate = projectAssignment.endDate;
        result.AssignedForInPersents = projectAssignment.assignedForInPersents;
        result.BillableForInPersents = projectAssignment.billableForInPersents;

        return result;
    }
}