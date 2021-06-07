jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IPurchaseDetails, PurchaseDetails } from '../purchase-details.model';
import { PurchaseDetailsService } from '../service/purchase-details.service';

import { PurchaseDetailsRoutingResolveService } from './purchase-details-routing-resolve.service';

describe('Service Tests', () => {
  describe('PurchaseDetails routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: PurchaseDetailsRoutingResolveService;
    let service: PurchaseDetailsService;
    let resultPurchaseDetails: IPurchaseDetails | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(PurchaseDetailsRoutingResolveService);
      service = TestBed.inject(PurchaseDetailsService);
      resultPurchaseDetails = undefined;
    });

    describe('resolve', () => {
      it('should return IPurchaseDetails returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPurchaseDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPurchaseDetails).toEqual({ id: 123 });
      });

      it('should return new IPurchaseDetails if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPurchaseDetails = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultPurchaseDetails).toEqual(new PurchaseDetails());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultPurchaseDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultPurchaseDetails).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
