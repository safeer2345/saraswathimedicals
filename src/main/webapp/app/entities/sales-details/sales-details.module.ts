import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { SalesDetailsComponent } from './list/sales-details.component';
import { SalesDetailsDetailComponent } from './detail/sales-details-detail.component';
import { SalesDetailsUpdateComponent } from './update/sales-details-update.component';
import { SalesDetailsDeleteDialogComponent } from './delete/sales-details-delete-dialog.component';
import { SalesDetailsRoutingModule } from './route/sales-details-routing.module';

@NgModule({
  imports: [SharedModule, SalesDetailsRoutingModule],
  declarations: [SalesDetailsComponent, SalesDetailsDetailComponent, SalesDetailsUpdateComponent, SalesDetailsDeleteDialogComponent],
  entryComponents: [SalesDetailsDeleteDialogComponent],
})
export class SalesDetailsModule {}
