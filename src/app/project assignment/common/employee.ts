import { Injectable } from "@angular/core";

@Injectable()
export class Employee {
    public employeeId: string;
    public fullName: string;
    public jobTitle: string;
    public technology?: string;
    public startDate: Date;
}