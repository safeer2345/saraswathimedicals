import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPurchaseDetails, PurchaseDetails } from '../purchase-details.model';
import { PurchaseDetailsService } from '../service/purchase-details.service';

@Injectable({ providedIn: 'root' })
export class PurchaseDetailsRoutingResolveService implements Resolve<IPurchaseDetails> {
  constructor(protected service: PurchaseDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPurchaseDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((purchaseDetails: HttpResponse<PurchaseDetails>) => {
          if (purchaseDetails.body) {
            return of(purchaseDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PurchaseDetails());
  }
}
