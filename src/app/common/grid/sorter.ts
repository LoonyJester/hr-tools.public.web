export class Sorter {
    sortColumnName: string;
    isDescending: boolean;

    public getSortConfig(data: any, columns: any, columnName: string, columnSort?: string): any {
        let sort: string = void 0;

        for (let i = 0; i < columns.length; i++) {

            if(columns[i].name == columnName){
                columns[i].sort = columnSort === 'desc' ? 'asc' : 'desc';
                sort = columns[i].sort;
            }else{
                columns[i].sort = '';
            }
        }

        return {
            sortColumnName: columnName,
            isDescending: sort === 'desc' ? true : false
        };
    }
}