import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalesDetails } from '../sales-details.model';
import { SalesDetailsService } from '../service/sales-details.service';

@Component({
  templateUrl: './sales-details-delete-dialog.component.html',
})
export class SalesDetailsDeleteDialogComponent {
  salesDetails?: ISalesDetails;

  constructor(protected salesDetailsService: SalesDetailsService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.salesDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
