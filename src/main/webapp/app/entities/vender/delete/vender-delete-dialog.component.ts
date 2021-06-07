import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVender } from '../vender.model';
import { VenderService } from '../service/vender.service';

@Component({
  templateUrl: './vender-delete-dialog.component.html',
})
export class VenderDeleteDialogComponent {
  vender?: IVender;

  constructor(protected venderService: VenderService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.venderService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
