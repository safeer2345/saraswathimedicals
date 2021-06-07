import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISalesDetails, SalesDetails } from '../sales-details.model';
import { SalesDetailsService } from '../service/sales-details.service';

@Injectable({ providedIn: 'root' })
export class SalesDetailsRoutingResolveService implements Resolve<ISalesDetails> {
  constructor(protected service: SalesDetailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISalesDetails> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((salesDetails: HttpResponse<SalesDetails>) => {
          if (salesDetails.body) {
            return of(salesDetails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new SalesDetails());
  }
}
