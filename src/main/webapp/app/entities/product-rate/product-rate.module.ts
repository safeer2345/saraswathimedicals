import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { ProductRateComponent } from './list/product-rate.component';
import { ProductRateDetailComponent } from './detail/product-rate-detail.component';
import { ProductRateUpdateComponent } from './update/product-rate-update.component';
import { ProductRateDeleteDialogComponent } from './delete/product-rate-delete-dialog.component';
import { ProductRateRoutingModule } from './route/product-rate-routing.module';

@NgModule({
  imports: [SharedModule, ProductRateRoutingModule],
  declarations: [ProductRateComponent, ProductRateDetailComponent, ProductRateUpdateComponent, ProductRateDeleteDialogComponent],
  entryComponents: [ProductRateDeleteDialogComponent],
})
export class ProductRateModule {}
