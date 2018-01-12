import { Component, Input, ViewChild } from '@angular/core';
import { Employee } from '../../employee';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
    selector: 'employee-details',
    templateUrl: 'details.template.html',
})

export class EmployeeDetailsModalComponent {
    @Input() employee: Employee;
    @ViewChild('detailsModal') detailsModal: ModalDirective;

    public showModal(): void {
        this.detailsModal.config.backdrop = false; // workaround 
        this.detailsModal.show();
    }
}