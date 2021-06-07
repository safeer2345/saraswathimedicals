import { NgModule } from '@angular/core';

import { SharedModule } from 'app/shared/shared.module';
import { VenderComponent } from './list/vender.component';
import { VenderDetailComponent } from './detail/vender-detail.component';
import { VenderUpdateComponent } from './update/vender-update.component';
import { VenderDeleteDialogComponent } from './delete/vender-delete-dialog.component';
import { VenderRoutingModule } from './route/vender-routing.module';

@NgModule({
  imports: [SharedModule, VenderRoutingModule],
  declarations: [VenderComponent, VenderDetailComponent, VenderUpdateComponent, VenderDeleteDialogComponent],
  entryComponents: [VenderDeleteDialogComponent],
})
export class VenderModule {}
