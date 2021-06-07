jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SalesDetailsService } from '../service/sales-details.service';
import { ISalesDetails, SalesDetails } from '../sales-details.model';
import { ISale } from 'app/entities/sale/sale.model';
import { SaleService } from 'app/entities/sale/service/sale.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { SalesDetailsUpdateComponent } from './sales-details-update.component';

describe('Component Tests', () => {
  describe('SalesDetails Management Update Component', () => {
    let comp: SalesDetailsUpdateComponent;
    let fixture: ComponentFixture<SalesDetailsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let salesDetailsService: SalesDetailsService;
    let saleService: SaleService;
    let productService: ProductService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SalesDetailsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SalesDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SalesDetailsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      salesDetailsService = TestBed.inject(SalesDetailsService);
      saleService = TestBed.inject(SaleService);
      productService = TestBed.inject(ProductService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Sale query and add missing value', () => {
        const salesDetails: ISalesDetails = { id: 456 };
        const sale: ISale = { id: 79215 };
        salesDetails.sale = sale;

        const saleCollection: ISale[] = [{ id: 30787 }];
        spyOn(saleService, 'query').and.returnValue(of(new HttpResponse({ body: saleCollection })));
        const additionalSales = [sale];
        const expectedCollection: ISale[] = [...additionalSales, ...saleCollection];
        spyOn(saleService, 'addSaleToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ salesDetails });
        comp.ngOnInit();

        expect(saleService.query).toHaveBeenCalled();
        expect(saleService.addSaleToCollectionIfMissing).toHaveBeenCalledWith(saleCollection, ...additionalSales);
        expect(comp.salesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Product query and add missing value', () => {
        const salesDetails: ISalesDetails = { id: 456 };
        const product: IProduct = { id: 48974 };
        salesDetails.product = product;

        const productCollection: IProduct[] = [{ id: 70164 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const additionalProducts = [product];
        const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ salesDetails });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
        expect(comp.productsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const salesDetails: ISalesDetails = { id: 456 };
        const sale: ISale = { id: 10144 };
        salesDetails.sale = sale;
        const product: IProduct = { id: 82448 };
        salesDetails.product = product;

        activatedRoute.data = of({ salesDetails });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(salesDetails));
        expect(comp.salesSharedCollection).toContain(sale);
        expect(comp.productsSharedCollection).toContain(product);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const salesDetails = { id: 123 };
        spyOn(salesDetailsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ salesDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: salesDetails }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(salesDetailsService.update).toHaveBeenCalledWith(salesDetails);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const salesDetails = new SalesDetails();
        spyOn(salesDetailsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ salesDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: salesDetails }));
        saveSubject.complete();

        // THEN
        expect(salesDetailsService.create).toHaveBeenCalledWith(salesDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const salesDetails = { id: 123 };
        spyOn(salesDetailsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ salesDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(salesDetailsService.update).toHaveBeenCalledWith(salesDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSaleById', () => {
        it('Should return tracked Sale primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackSaleById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackProductById', () => {
        it('Should return tracked Product primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackProductById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
