import { Component, Input } from '@angular/core';
import { EmployeeService } from './services/employee.service';
import { EmployeeComponent } from './employee.component';
import { Employee } from './employee';
import { EmployeesFilter } from './employeesFilter';
import { EmployeeSettings } from './EmployeeSettings';
import { AlertType } from "../../common/alerts/alertType";
import { BreadcrumbComponent } from '../../common/breadcrumb/breadcrumb.component';
import { PageHeaderComponent } from '../../common/page header/page-header.component';
import { PaginationComponent } from 'ng2-bootstrap/ng2-bootstrap';
import { UrlHelper } from "../../common/company/urlHelper";
import { AuthService } from '../../common/authorization/services/auth.service';

@Component({
    selector: 'employeeList',
    templateUrl: 'employee-list.template.html',
    styleUrls: ['employee-list.style.css'],
    providers: [EmployeeService, EmployeesFilter, UrlHelper]
})

export class EmployeeListComponent {
    public employees = new Array<Employee>();
    public pageSettings: EmployeeSettings;
    public officeLocations: Array<any>;
    public cities: Array<any>;
    public filters: EmployeesFilter = new EmployeesFilter();
    public alerts: Array<any> = [];
    public isLoading: boolean = true;

    constructor(private _employeeService: EmployeeService,
        public _authService: AuthService) {
        this.resetFilters();
        this.pageSettings = new EmployeeSettings(0, 1, 10, '', this.filters);

        this.employees = this.getAll(this.pageSettings);

        this._employeeService.getCountriesWithCities()
            .subscribe(response => {
                this.officeLocations = response;
                this.initFilters();
                this.isLoading = false;
            }
            , error => this.handleError(error));
    }

    private initFilters(): void {
        this.filters.officeLocations = this.officeLocations;
        this.resetFilters();

        this.filters.officeLocations.push({
            Country: this.filters.allCountriesText,
            Cities: [this.filters.allCitiesText]
        });

        this.initCities(this.filters.country);
    }

    public resetFilters(): void {
        this.filters.country = this.filters.allCountriesText;
        this.filters.city = this.filters.allCitiesText;
        this.filters.status = this.filters.statusList[0].id;
    }

    private initCities(country: string): Array<string> {
        let cities: Array<string> = new Array<string>();
        this.cities = cities;
        if (!country) {
            return;
        } else if (country == this.filters.allCountriesText) {
            this.cities.push(this.filters.allCitiesText);
            this.filters.city = this.filters.allCitiesText;

            return cities;
        }

        let selectedCountry: string = country;
        this.officeLocations.map(loc => {
            if (loc.Country == selectedCountry) {
                this.cities.push(this.filters.allCitiesText);
                Array.prototype.push.apply(cities, (loc.Cities));
            }
        });
    }

    public search(searchKeyword: string, filters: EmployeesFilter): void {
        this.isLoading = true;
        this.pageSettings.searchKeyword = searchKeyword;
        this.pageSettings.employeeFilter = filters;

        this.getAll(this.pageSettings);
    }

    public onPageChanged(event: any): void {
        this.isLoading = true;
        this.pageSettings.currentPage = event.page;

        this.getAll(this.pageSettings);
    }

    private getAll(gridSettings: EmployeeSettings): Array<Employee> {
        this._employeeService.getAll(gridSettings)
            .subscribe(response => {
                this.employees = response.data;
                this.pageSettings.totalCount = response.totalCount;
                this.isLoading = false;
            }
            , error => this.handleError(error));

        return this.employees;
    }

    private handleError(error: any): void {
        let errorMessage: string = "Some error has occured";

        if (error._body) {
            let errorBody = JSON.parse(error._body);
            if (errorBody.Message) {
                errorMessage = errorBody.Message;
            } else {
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
                timeout: 4000
            });
        }
    }

}