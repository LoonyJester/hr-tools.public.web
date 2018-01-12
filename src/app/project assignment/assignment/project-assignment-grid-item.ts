import { Injectable } from "@angular/core";
import { DatePipe } from "@angular/common";
import { GridItem } from "../../common/grid/gridItem";
import { ProjectAssignment } from "./project-assignment";

@Injectable()
export class ProjectAssignmentGridItem implements ProjectAssignment, GridItem {
    public id: number;
    public employeeId: string;
    public employeeFullName: string;
    public employeeJobTitle: string;
    public employeeTechnology: string;
    public projectId?: number;
    public projectName?: string;
    public departmentId: number;
    public departmentName: string;
    public startDate: Date;
    public endDate?: Date;
    public startDateToDisplay: string;
    public endDateToDisplay?: string;
    public assignedForInPersents: any;
    public billableForInPersents: any;
    public assignedForInPersentsSum: any;
    public billableForInPersentsSum: any;

    public edit: string;
    public _delete: string;
    public className: string;
    public warningTooltip: string;

    constructor(projectAssignment: ProjectAssignment) {
        var datePipe = new DatePipe("en-US");

        this.id = projectAssignment.id;
        this.employeeId = projectAssignment.employeeId;
        this.employeeFullName = projectAssignment.employeeFullName;
        this.employeeJobTitle = projectAssignment.employeeJobTitle;
        this.employeeTechnology = projectAssignment.employeeTechnology;
        this.projectId = projectAssignment.projectId;
        this.projectName = projectAssignment.projectName;
        this.departmentId = projectAssignment.departmentId;
        this.departmentName = projectAssignment.departmentName;
        this.startDate = projectAssignment.startDate;
        this.endDate = projectAssignment.endDate;
        this.startDateToDisplay = datePipe.transform(projectAssignment.startDate, "dd/MM/yyyy");
        this.endDateToDisplay = projectAssignment.endDate == null ? "" : datePipe.transform(projectAssignment.endDate, "dd/MM/yyyy");
        this.assignedForInPersents = projectAssignment.assignedForInPersents;
        this.billableForInPersents = projectAssignment.billableForInPersents;
        this.assignedForInPersentsSum = projectAssignment.assignedForInPersentsSum;
        this.billableForInPersentsSum = projectAssignment.billableForInPersentsSum;

        this.setClassNames();
    }

    public setClassNames(): void{
        let today = new Date();
        let dateWhenProjectNearOld = new Date(today.setMonth(today.getMonth() - 2));
        if(this.endDate != null && new Date(this.endDate)  > dateWhenProjectNearOld){
            this.className = "projectIsNearOld";
            this.warningTooltip = "Project will be finished soon";
        }
    }
}