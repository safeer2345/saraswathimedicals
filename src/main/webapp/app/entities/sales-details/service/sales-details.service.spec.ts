import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISalesDetails, SalesDetails } from '../sales-details.model';

import { SalesDetailsService } from './sales-details.service';

describe('Service Tests', () => {
  describe('SalesDetails Service', () => {
    let service: SalesDetailsService;
    let httpMock: HttpTestingController;
    let elemDefault: ISalesDetails;
    let expectedResult: ISalesDetails | ISalesDetails[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SalesDetailsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        quantity: 0,
        rate: 0,
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

      it('should create a SalesDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new SalesDetails()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a SalesDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantity: 1,
            rate: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a SalesDetails', () => {
        const patchObject = Object.assign(
          {
            quantity: 1,
            rate: 1,
          },
          new SalesDetails()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of SalesDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            quantity: 1,
            rate: 1,
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

      it('should delete a SalesDetails', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSalesDetailsToCollectionIfMissing', () => {
        it('should add a SalesDetails to an empty array', () => {
          const salesDetails: ISalesDetails = { id: 123 };
          expectedResult = service.addSalesDetailsToCollectionIfMissing([], salesDetails);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(salesDetails);
        });

        it('should not add a SalesDetails to an array that contains it', () => {
          const salesDetails: ISalesDetails = { id: 123 };
          const salesDetailsCollection: ISalesDetails[] = [
            {
              ...salesDetails,
            },
            { id: 456 },
          ];
          expectedResult = service.addSalesDetailsToCollectionIfMissing(salesDetailsCollection, salesDetails);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a SalesDetails to an array that doesn't contain it", () => {
          const salesDetails: ISalesDetails = { id: 123 };
          const salesDetailsCollection: ISalesDetails[] = [{ id: 456 }];
          expectedResult = service.addSalesDetailsToCollectionIfMissing(salesDetailsCollection, salesDetails);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(salesDetails);
        });

        it('should add only unique SalesDetails to an array', () => {
          const salesDetailsArray: ISalesDetails[] = [{ id: 123 }, { id: 456 }, { id: 64307 }];
          const salesDetailsCollection: ISalesDetails[] = [{ id: 123 }];
          expectedResult = service.addSalesDetailsToCollectionIfMissing(salesDetailsCollection, ...salesDetailsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const salesDetails: ISalesDetails = { id: 123 };
          const salesDetails2: ISalesDetails = { id: 456 };
          expectedResult = service.addSalesDetailsToCollectionIfMissing([], salesDetails, salesDetails2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(salesDetails);
          expect(expectedResult).toContain(salesDetails2);
        });

        it('should accept null and undefined values', () => {
          const salesDetails: ISalesDetails = { id: 123 };
          expectedResult = service.addSalesDetailsToCollectionIfMissing([], null, salesDetails, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(salesDetails);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
