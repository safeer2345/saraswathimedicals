import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IProductRate } from '../product-rate.model';
import { ProductRateService } from '../service/product-rate.service';
import { ProductRateDeleteDialogComponent } from '../delete/product-rate-delete-dialog.component';

@Component({
  selector: 'jhi-product-rate',
  templateUrl: './product-rate.component.html',
})
export class ProductRateComponent implements OnInit {
  productRates?: IProductRate[];
  isLoading = false;

  constructor(protected productRateService: ProductRateService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.productRateService.query().subscribe(
      (res: HttpResponse<IProductRate[]>) => {
        this.isLoading = false;
        this.productRates = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IProductRate): number {
    return item.id!;
  }

  delete(productRate: IProductRate): void {
    const modalRef = this.modalService.open(ProductRateDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.productRate = productRate;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
