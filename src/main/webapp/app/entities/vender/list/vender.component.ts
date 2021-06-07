import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVender } from '../vender.model';
import { VenderService } from '../service/vender.service';
import { VenderDeleteDialogComponent } from '../delete/vender-delete-dialog.component';

@Component({
  selector: 'jhi-vender',
  templateUrl: './vender.component.html',
})
export class VenderComponent implements OnInit {
  venders?: IVender[];
  isLoading = false;

  constructor(protected venderService: VenderService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.venderService.query().subscribe(
      (res: HttpResponse<IVender[]>) => {
        this.isLoading = false;
        this.venders = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IVender): number {
    return item.id!;
  }

  delete(vender: IVender): void {
    const modalRef = this.modalService.open(VenderDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.vender = vender;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
