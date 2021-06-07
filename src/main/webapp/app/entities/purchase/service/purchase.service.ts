import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPurchase, getPurchaseIdentifier } from '../purchase.model';

export type EntityResponseType = HttpResponse<IPurchase>;
export type EntityArrayResponseType = HttpResponse<IPurchase[]>;

@Injectable({ providedIn: 'root' })
export class PurchaseService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/purchases');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(purchase: IPurchase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchase);
    return this.http
      .post<IPurchase>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(purchase: IPurchase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchase);
    return this.http
      .put<IPurchase>(`${this.resourceUrl}/${getPurchaseIdentifier(purchase) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(purchase: IPurchase): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(purchase);
    return this.http
      .patch<IPurchase>(`${this.resourceUrl}/${getPurchaseIdentifier(purchase) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPurchase>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPurchase[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addPurchaseToCollectionIfMissing(purchaseCollection: IPurchase[], ...purchasesToCheck: (IPurchase | null | undefined)[]): IPurchase[] {
    const purchases: IPurchase[] = purchasesToCheck.filter(isPresent);
    if (purchases.length > 0) {
      const purchaseCollectionIdentifiers = purchaseCollection.map(purchaseItem => getPurchaseIdentifier(purchaseItem)!);
      const purchasesToAdd = purchases.filter(purchaseItem => {
        const purchaseIdentifier = getPurchaseIdentifier(purchaseItem);
        if (purchaseIdentifier == null || purchaseCollectionIdentifiers.includes(purchaseIdentifier)) {
          return false;
        }
        purchaseCollectionIdentifiers.push(purchaseIdentifier);
        return true;
      });
      return [...purchasesToAdd, ...purchaseCollection];
    }
    return purchaseCollection;
  }

  protected convertDateFromClient(purchase: IPurchase): IPurchase {
    return Object.assign({}, purchase, {
      date: purchase.date?.isValid() ? purchase.date.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? dayjs(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((purchase: IPurchase) => {
        purchase.date = purchase.date ? dayjs(purchase.date) : undefined;
      });
    }
    return res;
  }
}
