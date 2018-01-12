import { EmployeesFilter } from './employeesFilter';

export class EmployeeSettings {
    constructor(public totalCount: number,
        public currentPage: number, 
        public itemsPerPage: number, 
                
        public searchKeyword: string,
        
        public employeeFilter: EmployeesFilter){
    }
}