import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchaseDetails, getPurchaseDetailsIdentifier } from '../purchase-details.model';

export type EntityResponseType = HttpResponse<IPurchaseDetails>;
export type EntityArrayResponseType = HttpResponse<IPurchaseDetails[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseDetailsService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/purchase-details');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(purchaseDetails: IPurchaseDetails): Observable<EntityResponseType> {
    return this.http.post<IPurchaseDetails>(this.resourceUrl, purchaseDetails, { observe: 'response' });
  }

  update(purchaseDetails: IPurchaseDetails): Observable<EntityResponseType> {
    return this.http.put<IPurchaseDetails>(
      `${this.resourceUrl}/${getPurchaseDetailsIdentifier(purchaseDetails) as number}`,
      purchaseDetails,
      { observe: 'response' }
    );
  }

  partialUpdate(purchaseDetails: IPurchaseDetails): Observable<EntityResponseType> {
    return this.http.patch<IPurchaseDetails>(
      `${this.resourceUrl}/${getPurchaseDetailsIdentifier(purchaseDetails) as number}`,
      purchaseDetails,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPurchaseDetails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPurchaseDetails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPurchaseDetailsToCollectionIfMissing(
    purchaseDetailsCollection: IPurchaseDetails[],
    ...purchaseDetailsToCheck: (IPurchaseDetails | null | undefined)[]
  ): IPurchaseDetails[] {
    const purchaseDetails: IPurchaseDetails[] = purchaseDetailsToCheck.filter(isPresent);
    if (purchaseDetails.length > 0) {
      const purchaseDetailsCollectionIdentifiers = purchaseDetailsCollection.map(
        purchaseDetailsItem => getPurchaseDetailsIdentifier(purchaseDetailsItem)!
      );
      const purchaseDetailsToAdd = purchaseDetails.filter(purchaseDetailsItem => {
        const purchaseDetailsIdentifier = getPurchaseDetailsIdentifier(purchaseDetailsItem);
        if (purchaseDetailsIdentifier == null || purchaseDetailsCollectionIdentifiers.includes(purchaseDetailsIdentifier)) {
          return false;
        }
        purchaseDetailsCollectionIdentifiers.push(purchaseDetailsIdentifier);
        return true;
      });
      return [...purchaseDetailsToAdd, ...purchaseDetailsCollection];
    }
    return purchaseDetailsCollection;
  }
}
