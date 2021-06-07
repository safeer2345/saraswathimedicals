import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISalesDetails } from '../sales-details.model';

@Component({
  selector: 'jhi-sales-details-detail',
  templateUrl: './sales-details-detail.component.html',
})
export class SalesDetailsDetailComponent implements OnInit {
  salesDetails: ISalesDetails | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesDetails }) => {
      this.salesDetails = salesDetails;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
