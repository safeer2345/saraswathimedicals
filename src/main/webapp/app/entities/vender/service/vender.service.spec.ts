import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVender, Vender } from '../vender.model';

import { VenderService } from './vender.service';

describe('Service Tests', () => {
  describe('Vender Service', () => {
    let service: VenderService;
    let httpMock: HttpTestingController;
    let elemDefault: IVender;
    let expectedResult: IVender | IVender[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(VenderService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 0,
        name: 'AAAAAAA',
        address: 'AAAAAAA',
        contact: 0,
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

      it('should create a Vender', () => {
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

        service.create(new Vender()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Vender', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            address: 'BBBBBB',
            contact: 1,
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

      it('should partial update a Vender', () => {
        const patchObject = Object.assign(
          {
            name: 'BBBBBB',
            address: 'BBBBBB',
            contact: 1,
            date: currentDate.format(DATE_TIME_FORMAT),
          },
          new Vender()
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

      it('should return a list of Vender', () => {
        const returnedFromService = Object.assign(
          {
            id: 1,
            name: 'BBBBBB',
            address: 'BBBBBB',
            contact: 1,
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

      it('should delete a Vender', () => {
        service.delete(123).subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addVenderToCollectionIfMissing', () => {
        it('should add a Vender to an empty array', () => {
          const vender: IVender = { id: 123 };
          expectedResult = service.addVenderToCollectionIfMissing([], vender);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vender);
        });

        it('should not add a Vender to an array that contains it', () => {
          const vender: IVender = { id: 123 };
          const venderCollection: IVender[] = [
            {
              ...vender,
            },
            { id: 456 },
          ];
          expectedResult = service.addVenderToCollectionIfMissing(venderCollection, vender);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Vender to an array that doesn't contain it", () => {
          const vender: IVender = { id: 123 };
          const venderCollection: IVender[] = [{ id: 456 }];
          expectedResult = service.addVenderToCollectionIfMissing(venderCollection, vender);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vender);
        });

        it('should add only unique Vender to an array', () => {
          const venderArray: IVender[] = [{ id: 123 }, { id: 456 }, { id: 37222 }];
          const venderCollection: IVender[] = [{ id: 123 }];
          expectedResult = service.addVenderToCollectionIfMissing(venderCollection, ...venderArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const vender: IVender = { id: 123 };
          const vender2: IVender = { id: 456 };
          expectedResult = service.addVenderToCollectionIfMissing([], vender, vender2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(vender);
          expect(expectedResult).toContain(vender2);
        });

        it('should accept null and undefined values', () => {
          const vender: IVender = { id: 123 };
          expectedResult = service.addVenderToCollectionIfMissing([], null, vender, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(vender);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
