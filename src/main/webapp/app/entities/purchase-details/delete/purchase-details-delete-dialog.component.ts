import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPurchaseDetails } from '../purchase-details.model';
import { PurchaseDetailsService } from '../service/purchase-details.service';

@Component({
  templateUrl: './purchase-details-delete-dialog.component.html',
})
export class PurchaseDetailsDeleteDialogComponent {
  purchaseDetails?: IPurchaseDetails;

  constructor(protected purchaseDetailsService: PurchaseDetailsService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.purchaseDetailsService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
