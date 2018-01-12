import { Component, ViewChild, EventEmitter, Input } from '@angular/core';
import { ModalDirective } from 'ng2-bootstrap/components/modal/modal.component';

@Component({
    selector: 'delete-confirm',
    templateUrl: 'delete-confirm.template.html',
    outputs: ['canBeDeleted']
})

export class DeleteConfirmationModalComponent {
    @Input() message: string;
    @ViewChild('smModal') childModal: ModalDirective;
    data: any;
    canBeDeleted = new EventEmitter<any>();

    public show(data = null): void {
        if (data != null) {
            this.data = data;
        }

        this.childModal.config.backdrop = false; // workaround 
        this.childModal.show();
    }

    public hide(): void {
        this.childModal.hide();
    }

    public delete() {
        this.canBeDeleted.emit(this.data);
        this.hide();
    }
}