import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SalesDetailsComponent } from '../list/sales-details.component';
import { SalesDetailsDetailComponent } from '../detail/sales-details-detail.component';
import { SalesDetailsUpdateComponent } from '../update/sales-details-update.component';
import { SalesDetailsRoutingResolveService } from './sales-details-routing-resolve.service';

const salesDetailsRoute: Routes = [
  {
    path: '',
    component: SalesDetailsComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SalesDetailsDetailComponent,
    resolve: {
      salesDetails: SalesDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SalesDetailsUpdateComponent,
    resolve: {
      salesDetails: SalesDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SalesDetailsUpdateComponent,
    resolve: {
      salesDetails: SalesDetailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(salesDetailsRoute)],
  exports: [RouterModule],
})
export class SalesDetailsRoutingModule {}
