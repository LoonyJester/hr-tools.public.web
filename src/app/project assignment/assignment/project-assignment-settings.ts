import { ProjectAssignmentFilter } from './project-assignment-filter';
import { GridSettings } from '../../common/grid/gridSettings';

export class ProjectAssignmentSettings implements GridSettings{
    constructor(public totalCount: number,
        public currentPage: number, 
        public itemsPerPage: number,                
        public sortColumnName: string,
        public isDescending: boolean,

        public searchKeyword: string,
        
        public projectAssignmentFilter: ProjectAssignmentFilter){
    }
}