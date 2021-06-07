import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { PurchaseDetailsComponent } from './list/purchase-details.component';
import { PurchaseDetailsDetailComponent } from './detail/purchase-details-detail.component';
import { PurchaseDetailsUpdateComponent } from './update/purchase-details-update.component';
import { PurchaseDetailsDeleteDialogComponent } from './delete/purchase-details-delete-dialog.component';
import { PurchaseDetailsRoutingModule } from './route/purchase-details-routing.module';

@NgModule({
  imports: [SharedModule, PurchaseDetailsRoutingModule],
  declarations: [
    PurchaseDetailsComponent,
    PurchaseDetailsDetailComponent,
    PurchaseDetailsUpdateComponent,
    PurchaseDetailsDeleteDialogComponent,
  ],
  entryComponents: [PurchaseDetailsDeleteDialogComponent],
})
export class PurchaseDetailsModule {}
