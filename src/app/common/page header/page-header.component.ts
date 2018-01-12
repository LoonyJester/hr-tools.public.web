import { Component, Input } from '@angular/core';

@Component({
    selector: 'page-header',
    templateUrl: 'page-header.template.html',
    styleUrls: ['./page-header.style.css']
})

export class PageHeaderComponent {
    @Input() text: string;
}