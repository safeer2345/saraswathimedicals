import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPurchase } from '../purchase.model';
import { PurchaseService } from '../service/purchase.service';
import { PurchaseDeleteDialogComponent } from '../delete/purchase-delete-dialog.component';

@Component({
  selector: 'jhi-purchase',
  templateUrl: './purchase.component.html',
})
export class PurchaseComponent implements OnInit {
  purchases?: IPurchase[];
  isLoading = false;

  constructor(protected purchaseService: PurchaseService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.purchaseService.query().subscribe(
      (res: HttpResponse<IPurchase[]>) => {
        this.isLoading = false;
        this.purchases = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPurchase): number {
    return item.id!;
  }

  delete(purchase: IPurchase): void {
    const modalRef = this.modalService.open(PurchaseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.purchase = purchase;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
