import { Injectable } from '@angular/core';
import { JobTitle } from "../../core/common/models/job-title";
import { Technology } from "../../core/common/models/technology";
import { Department } from "../common/department";

@Injectable()
export class ProjectAssignmentFilter {
    public employeeId: string;
    public fullName: string;
    public fullNameList: Array<any>;

    public jobTitle: string;
    public jobTitleList: Array<JobTitle>;

    public technology: string;
    public technologyList: Array<Technology>;

    public projectId: number;
    public project: string;
    public projectList: Array<any>;

    public department: string;
    public departmentList: Array<Department>;

    public showOldAssignments: boolean;
    public showOldDeactivatedProjects: boolean;

    public selectedFullNameId;

    public isEmpty(): boolean {
        return this.fullName == "" &&
            this.jobTitle == "" &&
            this.technology == "" &&
            this.project == "" &&
            this.department == "" &&
            this.showOldAssignments == false &&
            this.showOldDeactivatedProjects == false;
    }
}