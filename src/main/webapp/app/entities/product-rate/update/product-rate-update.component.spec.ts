jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ProductRateService } from '../service/product-rate.service';
import { IProductRate, ProductRate } from '../product-rate.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

import { ProductRateUpdateComponent } from './product-rate-update.component';

describe('Component Tests', () => {
  describe('ProductRate Management Update Component', () => {
    let comp: ProductRateUpdateComponent;
    let fixture: ComponentFixture<ProductRateUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let productRateService: ProductRateService;
    let productService: ProductService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductRateUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ProductRateUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductRateUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      productRateService = TestBed.inject(ProductRateService);
      productService = TestBed.inject(ProductService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call product query and add missing value', () => {
        const productRate: IProductRate = { id: 456 };
        const product: IProduct = { id: 13820 };
        productRate.product = product;

        const productCollection: IProduct[] = [{ id: 89593 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const expectedCollection: IProduct[] = [product, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ productRate });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, product);
        expect(comp.productsCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const productRate: IProductRate = { id: 456 };
        const product: IProduct = { id: 9757 };
        productRate.product = product;

        activatedRoute.data = of({ productRate });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(productRate));
        expect(comp.productsCollection).toContain(product);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productRate = { id: 123 };
        spyOn(productRateService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productRate });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productRate }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(productRateService.update).toHaveBeenCalledWith(productRate);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productRate = new ProductRate();
        spyOn(productRateService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productRate });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: productRate }));
        saveSubject.complete();

        // THEN
        expect(productRateService.create).toHaveBeenCalledWith(productRate);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const productRate = { id: 123 };
        spyOn(productRateService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ productRate });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(productRateService.update).toHaveBeenCalledWith(productRate);
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
