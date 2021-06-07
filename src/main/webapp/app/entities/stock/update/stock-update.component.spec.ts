jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { StockService } from '../service/stock.service';
import { IStock, Stock } from '../stock.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { StockUpdateComponent } from './stock-update.component';

describe('Component Tests', () => {
  describe('Stock Management Update Component', () => {
    let comp: StockUpdateComponent;
    let fixture: ComponentFixture<StockUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let stockService: StockService;
    let productService: ProductService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [StockUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(StockUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(StockUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      stockService = TestBed.inject(StockService);
      productService = TestBed.inject(ProductService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call product query and add missing value', () => {
        const stock: IStock = { id: 456 };
        const product: IProduct = { id: 5596 };
        stock.product = product;

        const productCollection: IProduct[] = [{ id: 74598 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const expectedCollection: IProduct[] = [product, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ stock });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, product);
        expect(comp.productsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const stock: IStock = { id: 456 };
        const product: IProduct = { id: 92365 };
        stock.product = product;

        activatedRoute.data = of({ stock });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(stock));
        expect(comp.productsCollection).toContain(product);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const stock = { id: 123 };
        spyOn(stockService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ stock });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: stock }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(stockService.update).toHaveBeenCalledWith(stock);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const stock = new Stock();
        spyOn(stockService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ stock });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: stock }));
        saveSubject.complete();

        // THEN
        expect(stockService.create).toHaveBeenCalledWith(stock);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const stock = { id: 123 };
        spyOn(stockService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ stock });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(stockService.update).toHaveBeenCalledWith(stock);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
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
