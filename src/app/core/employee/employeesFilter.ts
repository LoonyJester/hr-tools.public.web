import {Injectable} from '@angular/core';
import { Status } from '../common/status.enum';

@Injectable()
export class EmployeesFilter{
    public officeLocations: Array<any>;
    public countryList: Array<string>;// this.officeLocations.,
    public country: string;
    public city: string;
    public cityList: Array<string>;
    public status: string;
    public statusList: Array<any>;

    public allCountriesText = "All Countries";
    public allCitiesText = "All Cities";
    public allStatusesText = "All Statuses";
    
    constructor(){
        this.statusList = [
            { id: -1, value: this.allStatusesText },
            { id: Status.Hired, value: Status[Status.Hired] },
            { id: Status.Dismissed, value: Status[Status.Dismissed] }];
    }

    public isEmpty(): boolean{
        if(this.country == this.allCountriesText
            && this.city == this.allCitiesText
            && this.status == Status.NotDefined.toString())
            {
                return true;
            }

        return false;
    }
}