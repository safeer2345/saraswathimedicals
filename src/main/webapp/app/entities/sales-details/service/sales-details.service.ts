import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISalesDetails, getSalesDetailsIdentifier } from '../sales-details.model';

export type EntityResponseType = HttpResponse<ISalesDetails>;
export type EntityArrayResponseType = HttpResponse<ISalesDetails[]>;

@Injectable({ providedIn: 'root' })
export class SalesDetailsService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/sales-details');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(salesDetails: ISalesDetails): Observable<EntityResponseType> {
    return this.http.post<ISalesDetails>(this.resourceUrl, salesDetails, { observe: 'response' });
  }

  update(salesDetails: ISalesDetails): Observable<EntityResponseType> {
    return this.http.put<ISalesDetails>(`${this.resourceUrl}/${getSalesDetailsIdentifier(salesDetails) as number}`, salesDetails, {
      observe: 'response',
    });
  }

  partialUpdate(salesDetails: ISalesDetails): Observable<EntityResponseType> {
    return this.http.patch<ISalesDetails>(`${this.resourceUrl}/${getSalesDetailsIdentifier(salesDetails) as number}`, salesDetails, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISalesDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISalesDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSalesDetailsToCollectionIfMissing(
    salesDetailsCollection: ISalesDetails[],
    ...salesDetailsToCheck: (ISalesDetails | null | undefined)[]
  ): ISalesDetails[] {
    const salesDetails: ISalesDetails[] = salesDetailsToCheck.filter(isPresent);
    if (salesDetails.length > 0) {
      const salesDetailsCollectionIdentifiers = salesDetailsCollection.map(
        salesDetailsItem => getSalesDetailsIdentifier(salesDetailsItem)!
      );
      const salesDetailsToAdd = salesDetails.filter(salesDetailsItem => {
        const salesDetailsIdentifier = getSalesDetailsIdentifier(salesDetailsItem);
        if (salesDetailsIdentifier == null || salesDetailsCollectionIdentifiers.includes(salesDetailsIdentifier)) {
          return false;
        }
        salesDetailsCollectionIdentifiers.push(salesDetailsIdentifier);
        return true;
      });
      return [...salesDetailsToAdd, ...salesDetailsCollection];
    }
    return salesDetailsCollection;
  }
}
