jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISalesDetails, SalesDetails } from '../sales-details.model';
import { SalesDetailsService } from '../service/sales-details.service';

import { SalesDetailsRoutingResolveService } from './sales-details-routing-resolve.service';

describe('Service Tests', () => {
  describe('SalesDetails routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SalesDetailsRoutingResolveService;
    let service: SalesDetailsService;
    let resultSalesDetails: ISalesDetails | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SalesDetailsRoutingResolveService);
      service = TestBed.inject(SalesDetailsService);
      resultSalesDetails = undefined;
    });

    describe('resolve', () => {
      it('should return ISalesDetails returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalesDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSalesDetails).toEqual({ id: 123 });
      });

      it('should return new ISalesDetails if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalesDetails = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSalesDetails).toEqual(new SalesDetails());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSalesDetails = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultSalesDetails).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
