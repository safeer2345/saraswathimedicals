import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductRate } from '../product-rate.model';
import { ProductRateService } from '../service/product-rate.service';

@Component({
  templateUrl: './product-rate-delete-dialog.component.html',
})
export class ProductRateDeleteDialogComponent {
  productRate?: IProductRate;

  constructor(protected productRateService: ProductRateService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.productRateService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
