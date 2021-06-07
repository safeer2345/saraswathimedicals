import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISalesDetails } from '../sales-details.model';
import { SalesDetailsService } from '../service/sales-details.service';
import { SalesDetailsDeleteDialogComponent } from '../delete/sales-details-delete-dialog.component';

@Component({
  selector: 'jhi-sales-details',
  templateUrl: './sales-details.component.html',
})
export class SalesDetailsComponent implements OnInit {
  salesDetails?: ISalesDetails[];
  isLoading = false;

  constructor(protected salesDetailsService: SalesDetailsService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.salesDetailsService.query().subscribe(
      (res: HttpResponse<ISalesDetails[]>) => {
        this.isLoading = false;
        this.salesDetails = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISalesDetails): number {
    return item.id!;
  }

  delete(salesDetails: ISalesDetails): void {
    const modalRef = this.modalService.open(SalesDetailsDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.salesDetails = salesDetails;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
