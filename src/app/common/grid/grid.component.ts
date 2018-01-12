import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Sorter } from './sorter';
import { GridSettings } from './gridSettings';
import { GridItem } from './gridItem';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'grid',
    inputs: ['rows: rows', 'columns: columns'],
    templateUrl: './grid.html',
    styleUrls: ['./grid.css'],
    outputs: ['cellClicked', 'gridStateChanged']
})

export class GridComponent {
    sorting = {};
    columns: Array<any>;
    rows: Array<GridItem>;
    cellClicked: EventEmitter<any> = new EventEmitter<any>();
    gridStateChanged: EventEmitter<GridSettings> = new EventEmitter<GridSettings>();

    public appScope: any;

    @Input() settings: GridSettings;

    constructor(private sanitizer: DomSanitizer) {

    }

    sorter = new Sorter();
 
    public sanitize(html: any) {
        return this.sanitizer.bypassSecurityTrustHtml(html);
    };

    public getData(row: any, propertyName: string): string {
        return propertyName.split('.').reduce(function (prev, curr) {
            return prev[curr];
        }, row);
    };

    public onCellClicked(row: any, column: any): void {
        let event: any = { row: row, column: column };

        if (column == "edit") {
            this.cellClicked.emit(event);
        } else if (column == "_delete") {
            this.cellClicked.emit(event);
        }
    }

    onChangeTable(event: any, column: any): any {
        if (this.rows) {
            let gridData: GridSettings;

            if (column) {
                let sortingInfo = this.sorter.getSortConfig(this.rows, this.columns, column.name, column.sort);
                this.settings.isDescending = sortingInfo.isDescending;

                gridData = new GridSettings(this.settings.totalCount, this.settings.currentPage, this.settings.itemsPerPage, column.name, sortingInfo.isDescending);
            } else {
                this.settings.currentPage = event.page;
                gridData = new GridSettings(this.settings.totalCount, this.settings.currentPage, this.settings.itemsPerPage, this.settings.sortColumnName, this.settings.isDescending);
            }

            this.gridStateChanged.emit(gridData);
        }
    }
}