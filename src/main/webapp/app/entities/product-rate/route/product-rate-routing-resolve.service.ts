import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProductRate, ProductRate } from '../product-rate.model';
import { ProductRateService } from '../service/product-rate.service';

@Injectable({ providedIn: 'root' })
export class ProductRateRoutingResolveService implements Resolve<IProductRate> {
  constructor(protected service: ProductRateService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProductRate> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((productRate: HttpResponse<ProductRate>) => {
          if (productRate.body) {
            return of(productRate.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ProductRate());
  }
}
