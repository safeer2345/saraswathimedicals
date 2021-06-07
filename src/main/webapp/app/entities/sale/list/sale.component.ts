import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISale } from '../sale.model';
import { SaleService } from '../service/sale.service';
import { SaleDeleteDialogComponent } from '../delete/sale-delete-dialog.component';

@Component({
  selector: 'jhi-sale',
  templateUrl: './sale.component.html',
})
export class SaleComponent implements OnInit {
  sales?: ISale[];
  isLoading = false;

  constructor(protected saleService: SaleService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.saleService.query().subscribe(
      (res: HttpResponse<ISale[]>) => {
        this.isLoading = false;
        this.sales = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISale): number {
    return item.id!;
  }

  delete(sale: ISale): void {
    const modalRef = this.modalService.open(SaleDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.sale = sale;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
