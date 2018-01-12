import { Component, ViewChild, EventEmitter, OnInit } from '@angular/core';
import { ProjectAssignment } from '../../project-assignment';
import { ProjectAssignmentService } from '../../services/project-assignment.service';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';
import { Observable } from 'rxjs/Observable';
import { Employee } from "../../../common/employee";
import { Project } from "../../../common/project";
import { Department } from "../../../common/department";
import { AlertType } from "../../../../common/alerts/alertType";
import * as moment from 'moment';

@Component({
    selector: 'add-edit-project-assignment',
    templateUrl: 'addEditProjectAssignmentModal.template.html',
    styleUrls: ['./addEditProjectAssignmentModal.style.css'],
    providers: [ProjectAssignmentService],
    outputs: ['projectAssignmentSaved']
})

export class AddEditProjectAssignmentModalComponent {
    @ViewChild('addModal') public childModal: ModalDirective;
    public addEditForm: FormGroup;
    public actionName: string;
    public projectAssignmentSaved = new EventEmitter<any>();

    public projectAssignment: ProjectAssignment = new ProjectAssignment();
    public selectedEmployee: Employee = new Employee();
    public selectedProject: Project = new Project();
    public selectedDepartment: Department = new Department();

    public departmentList: Array<any>;

    public fullNameAutoCompleteDataSource: Observable<any>;
    public projectAutoCompleteDataSource: Observable<any>;

    public isStartDatePickerOpened: boolean = false;
    public isEndDatePickerOpened: boolean = false;
    public datePickersValidationRules: any = {
        startDate: {
            minDate: new Date()
        },
        endDate: {
            minDate: new Date()
        }
    }
    
    public alerts: any = [];

    //private accessToken: string;
    private megabyteInBytes: number = 10000000;

    constructor(private _projectAssignmentService: ProjectAssignmentService,
        private formBuilder: FormBuilder) {

        this.addEditForm = formBuilder.group({
            employee: [this.projectAssignment.employeeFullName, Validators.required],
            employeeJobTitle: [{ value: this.projectAssignment.employeeJobTitle, disabled: true }],
            employeeTechnology: [{ value: this.projectAssignment.employeeTechnology, disabled: true }],
            project: [this.projectAssignment.projectName],
            department: [this.projectAssignment.departmentName, Validators.required],
            startDate: [this.projectAssignment.startDate],
            endDate: [this.projectAssignment.endDate],
            assignedFor: [this.projectAssignment.assignedForInPersents, Validators.required],
            billableFor: [this.projectAssignment.billableForInPersents, Validators.required]
        });

        //this.accessToken = this._projectAssignmentService.getAccessToken();

        this.fullNameAutoCompleteDataSource = Observable.create((observer: any) => {
            // Runs on every search
            observer.next(this.selectedEmployee.fullName);
        }).mergeMap((token: string) => this._projectAssignmentService.getEmployeesByNameAutocomplete(this.selectedEmployee.fullName));

        this.projectAutoCompleteDataSource = Observable.create((observer: any) => {
            // Runs on every search
            observer.next(this.selectedProject.name);
        }).mergeMap((token: string) => this._projectAssignmentService.getProjectsByNameAutocomplete(this.selectedProject.name, false, false));
    }

    public onEmployeeAutocompleteSelected(event: any): void {
        this.selectedEmployee.employeeId = event.item.employeeId;
        this.selectedEmployee.fullName = event.item.employeeFullName;
        this.selectedEmployee.jobTitle = event.item.employeeJobTitle;
        this.selectedEmployee.technology = event.item.employeeTechnology;
        this.selectedEmployee.startDate = event.item.employeeStartDate;
        
        this.projectAssignment.assignedForInPersentsSum = event.item.assignedForInPersentsSum;
        this.projectAssignment.billableForInPersentsSum = event.item.billableForInPersentsSum;

        this.validateAssignedFor({value: event.item.assignedForInPersentsSum});
        this.validateBillableFor({value: event.item.billableForInPersentsSum});
    }

    public onEmployeeAutocompleteNoResults(event: any): void {
        if (event) {
            this.selectedEmployee = new Employee();
        }
    }

    public onProjectAutocompleteSelected(event: any): void {
        this.selectedProject.id = event.item.id;
    }

    public onProjectAutocompleteNoResults(event: any): void {
        if (event) {
            this.selectedProject = new Project();
        }
    }

    public onDepartmentAutocompleteSelected(event: any): void {
        this.selectedDepartment.id = event.item.id;
    }

    public onDepartmentAutocompleteNoResults(event: any): void {
        if (event) {
            this.selectedDepartment = new Department();
        }
    }

    public showChildModal(actionName: string, departmentList: Array<any>, row: ProjectAssignment = null): void {
        this.actionName = actionName;

        this.initModels(departmentList, row);
        this.initDatePickers();

        this.childModal.config.backdrop = false; // workaround 
        this.childModal.show();
    }


    private initModels(departmentList: Array<any>, projectAssignment: ProjectAssignment): void {
        this.departmentList = departmentList;

        this.projectAssignment = projectAssignment;

        this.selectedEmployee.employeeId = projectAssignment.employeeId;
        this.selectedEmployee.fullName = projectAssignment.employeeFullName;
        this.selectedEmployee.jobTitle = projectAssignment.employeeJobTitle;
        this.selectedEmployee.technology = projectAssignment.employeeTechnology;

        this.selectedProject.id = projectAssignment.projectId;
        this.selectedProject.name = projectAssignment.projectName;

        this.selectedDepartment.id = projectAssignment.departmentId;
        this.selectedDepartment.name = projectAssignment.departmentName;
    }

    private initDatePickers(): void {
        let date: Date = new Date();

        this.datePickersValidationRules.startDate.minDate.setFullYear(date.getFullYear() - 20);
        this.setEndDateMinDate();
    }

    public normalizePersentValue(element: any): void {
        if (element.value > 100 && element.id == "assignedFor") {
            element.value = 100;
            this.projectAssignment.assignedForInPersents = 100;
        } else if (element.value > 100 && element.id == "billableFor") {
            element.value = 100;
            this.projectAssignment.billableForInPersents = 100;
        } else if (element.value < 0 && element.id == "assignedFor") {
            element.value = 0;
            this.projectAssignment.assignedForInPersents = 0;
        }
        else if (element.value < 0 && element.id == "billableFor") {
            element.value = 0;
            this.projectAssignment.billableForInPersents = 0;
        }
    }

    public validateAssignedFor(element: any): void {
        let newAssignedFor = element.value;

        if (this.projectAssignment.assignedForInPersentsSum + newAssignedFor > 100) {
            this.showErrorMessage("Employee is assigned for more than 100%", AlertType.Warning);
        }
    }

    public validateBillableFor(element: any): void {
        let newBillableFor = element.value;

        if (this.projectAssignment.billableForInPersentsSum + newBillableFor > 100) {
            this.showErrorMessage("Employee is billable for more than 100%", AlertType.Warning);
        }
    }

    public save(form: any): void {
        if (this.projectAssignment.startDate < new Date(this.selectedEmployee.startDate)) {
            if (!this.projectAssignment.id) {
                this.showErrorMessage("Assignment cannot be created: start date can not be more than Employee's start date", AlertType.Error);
            } else {
                this.showErrorMessage("Assignment cannot be updated: start date can not be more than Employee's start date", AlertType.Error);
            }
            return;
        }

        this.projectAssignment.employeeId = this.selectedEmployee.employeeId;

        this.projectAssignment.projectId = this.selectedProject.id;
        this.projectAssignment.departmentId = this.selectedDepartment.id;

        this.projectAssignmentSaved.emit(this.projectAssignment);
        this.addEditForm.reset();
        this.hideChildModal();
    }

    private hideChildModal(): void {
        this.childModal.hide();
    }

    public openStartDatePicker(): void {
        this.isStartDatePickerOpened = !this.isStartDatePickerOpened;

        if (this.isStartDatePickerOpened) {
            this.isEndDatePickerOpened = false;
        }
    }

    public openEndDatePicker(): void {
        this.isEndDatePickerOpened = !this.isEndDatePickerOpened;

        if (this.isEndDatePickerOpened) {
            this.isStartDatePickerOpened = false;

            this.setEndDateMinDate();
        }
    }

    private setEndDateMinDate(): void {
        if (this.projectAssignment.startDate) {
            this.datePickersValidationRules.endDate.minDate = new Date(Date.parse(this.projectAssignment.startDate.toString()));
        } else {
            this.datePickersValidationRules.endDate.minDate.setFullYear(new Date().getFullYear() - 20);
        }
    }

    public clearEndDatePicker(): void {
        this.projectAssignment.endDate = null;
    }

    private showErrorMessage(message: string, type: string): void {
        if (!this.alerts.some(x => x.msg == message)) {
            this.alerts.push({
                type: type,
                msg: message,
                timeout: 4000
            });
        }
    }
}