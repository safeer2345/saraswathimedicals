import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IPurchaseDetails } from '../purchase-details.model';

@Component({
  selector: 'jhi-purchase-details-detail',
  templateUrl: './purchase-details-detail.component.html',
})
export class PurchaseDetailsDetailComponent implements OnInit {
  purchaseDetails: IPurchaseDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseDetails }) => {
      this.purchaseDetails = purchaseDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
