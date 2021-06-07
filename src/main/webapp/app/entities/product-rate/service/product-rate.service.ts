import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProductRate, getProductRateIdentifier } from '../product-rate.model';

export type EntityResponseType = HttpResponse<IProductRate>;
export type EntityArrayResponseType = HttpResponse<IProductRate[]>;

@Injectable({ providedIn: 'root' })
export class ProductRateService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/product-rates');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(productRate: IProductRate): Observable<EntityResponseType> {
    return this.http.post<IProductRate>(this.resourceUrl, productRate, { observe: 'response' });
  }

  update(productRate: IProductRate): Observable<EntityResponseType> {
    return this.http.put<IProductRate>(`${this.resourceUrl}/${getProductRateIdentifier(productRate) as number}`, productRate, {
      observe: 'response',
    });
  }

  partialUpdate(productRate: IProductRate): Observable<EntityResponseType> {
    return this.http.patch<IProductRate>(`${this.resourceUrl}/${getProductRateIdentifier(productRate) as number}`, productRate, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProductRate>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProductRate[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProductRateToCollectionIfMissing(
    productRateCollection: IProductRate[],
    ...productRatesToCheck: (IProductRate | null | undefined)[]
  ): IProductRate[] {
    const productRates: IProductRate[] = productRatesToCheck.filter(isPresent);
    if (productRates.length > 0) {
      const productRateCollectionIdentifiers = productRateCollection.map(productRateItem => getProductRateIdentifier(productRateItem)!);
      const productRatesToAdd = productRates.filter(productRateItem => {
        const productRateIdentifier = getProductRateIdentifier(productRateItem);
        if (productRateIdentifier == null || productRateCollectionIdentifiers.includes(productRateIdentifier)) {
          return false;
        }
        productRateCollectionIdentifiers.push(productRateIdentifier);
        return true;
      });
      return [...productRatesToAdd, ...productRateCollection];
    }
    return productRateCollection;
  }
}
