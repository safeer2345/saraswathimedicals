import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPurchaseDetails } from '../purchase-details.model';
import { PurchaseDetailsService } from '../service/purchase-details.service';
import { PurchaseDetailsDeleteDialogComponent } from '../delete/purchase-details-delete-dialog.component';

@Component({
  selector: 'jhi-purchase-details',
  templateUrl: './purchase-details.component.html',
})
export class PurchaseDetailsComponent implements OnInit {
  purchaseDetails?: IPurchaseDetails[];
  isLoading = false;

  constructor(protected purchaseDetailsService: PurchaseDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.purchaseDetailsService.query().subscribe(
      (res: HttpResponse<IPurchaseDetails[]>) => {
        this.isLoading = false;
        this.purchaseDetails = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IPurchaseDetails): number {
    return item.id!;
  }

  delete(purchaseDetails: IPurchaseDetails): void {
    const modalRef = this.modalService.open(PurchaseDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.purchaseDetails = purchaseDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
