import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVender, getVenderIdentifier } from '../vender.model';

export type EntityResponseType = HttpResponse<IVender>;
export type EntityArrayResponseType = HttpResponse<IVender[]>;

@Injectable({ providedIn: 'root' })
export class VenderService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/venders');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(vender: IVender): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vender);
    return this.http
      .post<IVender>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(vender: IVender): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vender);
    return this.http
      .put<IVender>(`${this.resourceUrl}/${getVenderIdentifier(vender) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(vender: IVender): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vender);
    return this.http
      .patch<IVender>(`${this.resourceUrl}/${getVenderIdentifier(vender) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IVender>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IVender[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addVenderToCollectionIfMissing(venderCollection: IVender[], ...vendersToCheck: (IVender | null | undefined)[]): IVender[] {
    const venders: IVender[] = vendersToCheck.filter(isPresent);
    if (venders.length > 0) {
      const venderCollectionIdentifiers = venderCollection.map(venderItem => getVenderIdentifier(venderItem)!);
      const vendersToAdd = venders.filter(venderItem => {
        const venderIdentifier = getVenderIdentifier(venderItem);
        if (venderIdentifier == null || venderCollectionIdentifiers.includes(venderIdentifier)) {
          return false;
        }
        venderCollectionIdentifiers.push(venderIdentifier);
        return true;
      });
      return [...vendersToAdd, ...venderCollection];
    }
    return venderCollection;
  }

  protected convertDateFromClient(vender: IVender): IVender {
    return Object.assign({}, vender, {
      date: vender.date?.isValid() ? vender.date.toJSON() : undefined,
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
      res.body.forEach((vender: IVender) => {
        vender.date = vender.date ? dayjs(vender.date) : undefined;
      });
    }
    return res;
  }
}
