import { Component, Input, ViewChild } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { Employee } from './employee';
import { EmployeeDetailsModalComponent } from './modals/details/details.component';
import { UrlHelper } from "../../common/company/urlHelper";

@Component({
    selector: 'employee',
    templateUrl: 'employee.template.html',
    styleUrls: ['employee.style.css'],
    providers: [UrlHelper],
})

export class EmployeeComponent {
    @Input() employee;
    @ViewChild(EmployeeDetailsModalComponent) detailsModal: EmployeeDetailsModalComponent

    constructor() { }

    public toggleClass(element: any, className: string): void {
        element.classList.toggle(className);
    }

    public showDetails(): void {
        this.detailsModal.showModal();
    }
}