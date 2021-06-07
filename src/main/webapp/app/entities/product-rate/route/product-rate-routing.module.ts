import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ProductRateComponent } from '../list/product-rate.component';
import { ProductRateDetailComponent } from '../detail/product-rate-detail.component';
import { ProductRateUpdateComponent } from '../update/product-rate-update.component';
import { ProductRateRoutingResolveService } from './product-rate-routing-resolve.service';

const productRateRoute: Routes = [
  {
    path: '',
    component: ProductRateComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ProductRateDetailComponent,
    resolve: {
      productRate: ProductRateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ProductRateUpdateComponent,
    resolve: {
      productRate: ProductRateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ProductRateUpdateComponent,
    resolve: {
      productRate: ProductRateRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productRateRoute)],
  exports: [RouterModule],
})
export class ProductRateRoutingModule {}
