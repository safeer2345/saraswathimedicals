import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IProductRate, ProductRate } from '../product-rate.model';

import { ProductRateService } from './product-rate.service';

describe('Service Tests', () => {
  describe('ProductRate Service', () => {
    let service: ProductRateService;
    let httpMock: HttpTestingController;
    let elemDefault: IProductRate;
    let expectedResult: IProductRate | IProductRate[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ProductRateService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        price: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a ProductRate', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new ProductRate()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a ProductRate', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            price: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a ProductRate', () => {
        const patchObject = Object.assign({}, new ProductRate());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of ProductRate', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            price: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a ProductRate', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addProductRateToCollectionIfMissing', () => {
        it('should add a ProductRate to an empty array', () => {
          const productRate: IProductRate = { id: 123 };
          expectedResult = service.addProductRateToCollectionIfMissing([], productRate);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productRate);
        });

        it('should not add a ProductRate to an array that contains it', () => {
          const productRate: IProductRate = { id: 123 };
          const productRateCollection: IProductRate[] = [
            {
              ...productRate,
            },
            { id: 456 },
          ];
          expectedResult = service.addProductRateToCollectionIfMissing(productRateCollection, productRate);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a ProductRate to an array that doesn't contain it", () => {
          const productRate: IProductRate = { id: 123 };
          const productRateCollection: IProductRate[] = [{ id: 456 }];
          expectedResult = service.addProductRateToCollectionIfMissing(productRateCollection, productRate);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productRate);
        });

        it('should add only unique ProductRate to an array', () => {
          const productRateArray: IProductRate[] = [{ id: 123 }, { id: 456 }, { id: 88994 }];
          const productRateCollection: IProductRate[] = [{ id: 123 }];
          expectedResult = service.addProductRateToCollectionIfMissing(productRateCollection, ...productRateArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const productRate: IProductRate = { id: 123 };
          const productRate2: IProductRate = { id: 456 };
          expectedResult = service.addProductRateToCollectionIfMissing([], productRate, productRate2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(productRate);
          expect(expectedResult).toContain(productRate2);
        });

        it('should accept null and undefined values', () => {
          const productRate: IProductRate = { id: 123 };
          expectedResult = service.addProductRateToCollectionIfMissing([], null, productRate, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(productRate);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
