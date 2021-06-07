import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PurchaseDetailsComponent } from '../list/purchase-details.component';
import { PurchaseDetailsDetailComponent } from '../detail/purchase-details-detail.component';
import { PurchaseDetailsUpdateComponent } from '../update/purchase-details-update.component';
import { PurchaseDetailsRoutingResolveService } from './purchase-details-routing-resolve.service';

const purchaseDetailsRoute: Routes = [
  {
    path: '',
    component: PurchaseDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PurchaseDetailsDetailComponent,
    resolve: {
      purchaseDetails: PurchaseDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PurchaseDetailsUpdateComponent,
    resolve: {
      purchaseDetails: PurchaseDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PurchaseDetailsUpdateComponent,
    resolve: {
      purchaseDetails: PurchaseDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(purchaseDetailsRoute)],
  exports: [RouterModule],
})
export class PurchaseDetailsRoutingModule {}
