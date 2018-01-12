import { Injectable } from '@angular/core';
import { Http, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Employee } from '../employee';
import { EmployeesFilter } from '../employeesFilter';
import { EmployeeSettings } from '../EmployeeSettings';
import { GridData } from '../../common/gridData';
import { UrlHelper } from "../../../common/company/urlHelper";
import { AuthService } from '../../../common/authorization/services/auth.service';

@Injectable()
export class EmployeeService {
    private publicApiUrl: string;

    constructor(private _http: Http,
        private _authService: AuthService,
        private _urlHelper: UrlHelper) {
        let host: string = location.hostname;
        this.publicApiUrl = this._urlHelper.getApiUrl(host);
    }

    getAll(gridSettings: EmployeeSettings): Observable<GridData<Employee>> {
        let headers: Headers = this._authService.getHeaders();
        let params: URLSearchParams = new URLSearchParams();

        params.set('gridSettings',
            JSON.stringify({
                PagingSettings: {
                    CurrentPage: gridSettings.currentPage,
                    ItemsPerPage: gridSettings.itemsPerPage
                },
                SortingSettings: {
                    SortColumnName: 'firstName'
                },
                SearchKeyword: gridSettings.searchKeyword,
                EmployeeFilter: gridSettings.employeeFilter.isEmpty() ? {} : {
                    Country: gridSettings.employeeFilter.country == gridSettings.employeeFilter.allCountriesText ? "" : gridSettings.employeeFilter.country,
                    City: gridSettings.employeeFilter.city == gridSettings.employeeFilter.allCitiesText ? "" : gridSettings.employeeFilter.city,
                    Status: gridSettings.employeeFilter.status
                }
            }));

        return this._http.get(this.publicApiUrl + 'Api/GetAllEmployees', {
            search: params,
            headers
        }).map(res => {
            let result = new GridData<Employee>();
            let jsonRes = res.json();

            result.data = jsonRes.Data.map(this.mapBEToEmployee);
            result.totalCount = jsonRes.TotalCount;

            return result;
        });
    }

    getCountriesWithCities(): Observable<any> {
        let headers: Headers = this._authService.getHeaders();

        return this._http.get(this.publicApiUrl + 'Api/GetCountriesWithCities', {
            headers
        }).map(res =>
            res.json()//.map(this.mapBEToOfficeLocationList)
            );
    }

    private mapBEToEmployee(employee: any): Employee {
        let defaultPhotoUrl: string = "http://www.freeiconspng.com/uploads/profile-icon-9.png";
        let result = new Employee();

        result.id = employee.EmployeeId;
        result.fullName = employee.FullName;
        result.fullNameCyrillic = employee.FullNameCyrillic;
        result.patronymicCyrillic = employee.PatronymicCyrillic;
        result.jobTitle = employee.JobTitle;
        result.departmentName = employee.DepartmentName;
        result.technology = employee.Technology;
        result.projectName = employee.ProjectName;
        result.companyEmail = employee.CompanyEmail;
        result.personalEmail = employee.PersonalEmail;
        result.messengerName = employee.Messenger.Name;
        result.messengerLogin = employee.Messenger.Login;
        result.mobileNumber = employee.MobileNumber;
        result.additionalMobileNumber = employee.AdditionalMobileNumber;
        result.birthday = new Date(employee.Birthday);
        result.status = employee.Status;
        result.startDate = new Date(employee.StartDate);
        result.terminationDate = new Date(employee.TerminationDate);
        result.daysSkipped = employee.DaysSkipped;

        let millisecondsInDay = 1000 * 60 * 60 * 24;
        let timeDiff = Math.abs(new Date().getTime() - result.startDate.getTime() - result.daysSkipped * millisecondsInDay);


        let days = Math.floor(timeDiff / millisecondsInDay);
        let months = Math.floor(days / 31);
        let years = Math.floor(months / 12);
        //let diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

        result.timeInCompanyMilliseconds = timeDiff;
        result.timeInCompanyFormatted = years + "y. " + months + 'm. ' + days + 'd.';
        result.bioUrl = employee.BioUrl;
        result.photo = employee.PhotoUrl;
        if (!result.photo) {
            result.photo = defaultPhotoUrl;
        }

        result.notes = employee.Notes;
        result.country = employee.OfficeLocation.Country;
        result.city = employee.OfficeLocation.City;

        return result;
    }
}