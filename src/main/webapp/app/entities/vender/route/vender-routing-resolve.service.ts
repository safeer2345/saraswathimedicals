import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVender, Vender } from '../vender.model';
import { VenderService } from '../service/vender.service';

@Injectable({ providedIn: 'root' })
export class VenderRoutingResolveService implements Resolve<IVender> {
  constructor(protected service: VenderService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVender> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vender: HttpResponse<Vender>) => {
          if (vender.body) {
            return of(vender.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Vender());
  }
}
