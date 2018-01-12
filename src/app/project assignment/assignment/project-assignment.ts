import {Injectable} from "@angular/core";

@Injectable()
export class ProjectAssignment{
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
    public assignedForInPersents: number;
    public billableForInPersents: number;
    public assignedForInPersentsSum: number;
    public billableForInPersentsSum: number;
}