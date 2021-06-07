import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VenderComponent } from '../list/vender.component';
import { VenderDetailComponent } from '../detail/vender-detail.component';
import { VenderUpdateComponent } from '../update/vender-update.component';
import { VenderRoutingResolveService } from './vender-routing-resolve.service';

const venderRoute: Routes = [
  {
    path: '',
    component: VenderComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VenderDetailComponent,
    resolve: {
      vender: VenderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VenderUpdateComponent,
    resolve: {
      vender: VenderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VenderUpdateComponent,
    resolve: {
      vender: VenderRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(venderRoute)],
  exports: [RouterModule],
})
export class VenderRoutingModule {}
