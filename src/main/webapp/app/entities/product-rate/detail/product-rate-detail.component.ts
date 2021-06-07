import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IProductRate } from '../product-rate.model';

@Component({
  selector: 'jhi-product-rate-detail',
  templateUrl: './product-rate-detail.component.html',
})
export class ProductRateDetailComponent implements OnInit {
  productRate: IProductRate | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productRate }) => {
      this.productRate = productRate;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
