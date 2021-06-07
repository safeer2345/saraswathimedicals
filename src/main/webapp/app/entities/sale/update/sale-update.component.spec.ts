jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SaleService } from '../service/sale.service';
import { ISale, Sale } from '../sale.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { SaleUpdateComponent } from './sale-update.component';

describe('Component Tests', () => {
  describe('Sale Management Update Component', () => {
    let comp: SaleUpdateComponent;
    let fixture: ComponentFixture<SaleUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let saleService: SaleService;
    let customerService: CustomerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SaleUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SaleUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SaleUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      saleService = TestBed.inject(SaleService);
      customerService = TestBed.inject(CustomerService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Customer query and add missing value', () => {
        const sale: ISale = { id: 456 };
        const customer: ICustomer = { id: 84751 };
        sale.customer = customer;

        const customerCollection: ICustomer[] = [{ id: 7192 }];
        spyOn(customerService, 'query').and.returnValue(of(new HttpResponse({ body: customerCollection })));
        const additionalCustomers = [customer];
        const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
        spyOn(customerService, 'addCustomerToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ sale });
        comp.ngOnInit();

        expect(customerService.query).toHaveBeenCalled();
        expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(customerCollection, ...additionalCustomers);
        expect(comp.customersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const sale: ISale = { id: 456 };
        const customer: ICustomer = { id: 443 };
        sale.customer = customer;

        activatedRoute.data = of({ sale });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(sale));
        expect(comp.customersSharedCollection).toContain(customer);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sale = { id: 123 };
        spyOn(saleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sale });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sale }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(saleService.update).toHaveBeenCalledWith(sale);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sale = new Sale();
        spyOn(saleService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sale });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: sale }));
        saveSubject.complete();

        // THEN
        expect(saleService.create).toHaveBeenCalledWith(sale);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const sale = { id: 123 };
        spyOn(saleService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ sale });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(saleService.update).toHaveBeenCalledWith(sale);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackCustomerById', () => {
        it('Should return tracked Customer primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCustomerById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
