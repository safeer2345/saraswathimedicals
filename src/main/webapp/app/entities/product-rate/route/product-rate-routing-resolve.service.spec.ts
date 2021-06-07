jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProductRate, ProductRate } from '../product-rate.model';
import { ProductRateService } from '../service/product-rate.service';

import { ProductRateRoutingResolveService } from './product-rate-routing-resolve.service';

describe('Service Tests', () => {
  describe('ProductRate routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProductRateRoutingResolveService;
    let service: ProductRateService;
    let resultProductRate: IProductRate | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProductRateRoutingResolveService);
      service = TestBed.inject(ProductRateService);
      resultProductRate = undefined;
    });

    describe('resolve', () => {
      it('should return IProductRate returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductRate = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductRate).toEqual({ id: 123 });
      });

      it('should return new IProductRate if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductRate = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProductRate).toEqual(new ProductRate());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 123 };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProductRate = result;
        });

        // THEN
        expect(service.find).toBeCalledWith(123);
        expect(resultProductRate).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
