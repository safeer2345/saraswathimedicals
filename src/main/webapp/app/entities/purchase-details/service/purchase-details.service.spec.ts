import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPurchaseDetails, PurchaseDetails } from '../purchase-details.model';

import { PurchaseDetailsService } from './purchase-details.service';

describe('Service Tests', () => {
  describe('PurchaseDetails Service', () => {
    let service: PurchaseDetailsService;
    let httpMock: HttpTestingController;
    let elemDefault: IPurchaseDetails;
    let expectedResult: IPurchaseDetails | IPurchaseDetails[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PurchaseDetailsService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 0,
        rate: 0,
        quantity: 0,
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

      it('should create a PurchaseDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new PurchaseDetails()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a PurchaseDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            rate: 1,
            quantity: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a PurchaseDetails', () => {
        const patchObject = Object.assign({}, new PurchaseDetails());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of PurchaseDetails', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            rate: 1,
            quantity: 1,
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

      it('should delete a PurchaseDetails', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPurchaseDetailsToCollectionIfMissing', () => {
        it('should add a PurchaseDetails to an empty array', () => {
          const purchaseDetails: IPurchaseDetails = { id: 123 };
          expectedResult = service.addPurchaseDetailsToCollectionIfMissing([], purchaseDetails);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(purchaseDetails);
        });

        it('should not add a PurchaseDetails to an array that contains it', () => {
          const purchaseDetails: IPurchaseDetails = { id: 123 };
          const purchaseDetailsCollection: IPurchaseDetails[] = [
            {
              ...purchaseDetails,
            },
            { id: 456 },
          ];
          expectedResult = service.addPurchaseDetailsToCollectionIfMissing(purchaseDetailsCollection, purchaseDetails);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a PurchaseDetails to an array that doesn't contain it", () => {
          const purchaseDetails: IPurchaseDetails = { id: 123 };
          const purchaseDetailsCollection: IPurchaseDetails[] = [{ id: 456 }];
          expectedResult = service.addPurchaseDetailsToCollectionIfMissing(purchaseDetailsCollection, purchaseDetails);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(purchaseDetails);
        });

        it('should add only unique PurchaseDetails to an array', () => {
          const purchaseDetailsArray: IPurchaseDetails[] = [{ id: 123 }, { id: 456 }, { id: 78259 }];
          const purchaseDetailsCollection: IPurchaseDetails[] = [{ id: 123 }];
          expectedResult = service.addPurchaseDetailsToCollectionIfMissing(purchaseDetailsCollection, ...purchaseDetailsArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const purchaseDetails: IPurchaseDetails = { id: 123 };
          const purchaseDetails2: IPurchaseDetails = { id: 456 };
          expectedResult = service.addPurchaseDetailsToCollectionIfMissing([], purchaseDetails, purchaseDetails2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(purchaseDetails);
          expect(expectedResult).toContain(purchaseDetails2);
        });

        it('should accept null and undefined values', () => {
          const purchaseDetails: IPurchaseDetails = { id: 123 };
          expectedResult = service.addPurchaseDetailsToCollectionIfMissing([], null, purchaseDetails, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(purchaseDetails);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
