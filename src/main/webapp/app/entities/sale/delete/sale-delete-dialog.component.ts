import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISale } from '../sale.model';
import { SaleService } from '../service/sale.service';

@Component({
  templateUrl: './sale-delete-dialog.component.html',
})
export class SaleDeleteDialogComponent {
  sale?: ISale;

  constructor(protected saleService: SaleService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.saleService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
