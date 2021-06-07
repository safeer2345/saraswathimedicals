import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISale, Sale } from '../sale.model';

import { SaleService } from './sale.service';

describe('Service Tests', () => {
  describe('Sale Service', () => {
    let service: SaleService;
    let httpMock: HttpTestingController;
    let elemDefault: ISale;
    let expectedResult: ISale | ISale[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SaleService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        toatal: 0,
        date: currentDate,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find(123).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Sale', () => {
        const returnedFromService = Object.assign(
          {
            id: 0,
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.create(new Sale()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Sale', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            toatal: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Sale', () => {
        const patchObject = Object.assign(
          {
            toatal: 1,
          },
          new Sale()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Sale', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            toatal: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            date: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Sale', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSaleToCollectionIfMissing', () => {
        it('should add a Sale to an empty array', () => {
          const sale: ISale = { id: 123 };
          expectedResult = service.addSaleToCollectionIfMissing([], sale);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sale);
        });

        it('should not add a Sale to an array that contains it', () => {
          const sale: ISale = { id: 123 };
          const saleCollection: ISale[] = [
            {
              ...sale,
            },
            { id: 456 },
          ];
          expectedResult = service.addSaleToCollectionIfMissing(saleCollection, sale);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Sale to an array that doesn't contain it", () => {
          const sale: ISale = { id: 123 };
          const saleCollection: ISale[] = [{ id: 456 }];
          expectedResult = service.addSaleToCollectionIfMissing(saleCollection, sale);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sale);
        });

        it('should add only unique Sale to an array', () => {
          const saleArray: ISale[] = [{ id: 123 }, { id: 456 }, { id: 91474 }];
          const saleCollection: ISale[] = [{ id: 123 }];
          expectedResult = service.addSaleToCollectionIfMissing(saleCollection, ...saleArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const sale: ISale = { id: 123 };
          const sale2: ISale = { id: 456 };
          expectedResult = service.addSaleToCollectionIfMissing([], sale, sale2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(sale);
          expect(expectedResult).toContain(sale2);
        });

        it('should accept null and undefined values', () => {
          const sale: ISale = { id: 123 };
          expectedResult = service.addSaleToCollectionIfMissing([], null, sale, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(sale);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
