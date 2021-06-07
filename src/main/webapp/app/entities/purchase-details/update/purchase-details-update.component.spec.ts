jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PurchaseDetailsService } from '../service/purchase-details.service';
import { IPurchaseDetails, PurchaseDetails } from '../purchase-details.model';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IPurchase } from 'app/entities/purchase/purchase.model';
import { PurchaseService } from 'app/entities/purchase/service/purchase.service';

import { PurchaseDetailsUpdateComponent } from './purchase-details-update.component';

describe('Component Tests', () => {
  describe('PurchaseDetails Management Update Component', () => {
    let comp: PurchaseDetailsUpdateComponent;
    let fixture: ComponentFixture<PurchaseDetailsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let purchaseDetailsService: PurchaseDetailsService;
    let productService: ProductService;
    let purchaseService: PurchaseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PurchaseDetailsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PurchaseDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PurchaseDetailsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      purchaseDetailsService = TestBed.inject(PurchaseDetailsService);
      productService = TestBed.inject(ProductService);
      purchaseService = TestBed.inject(PurchaseService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Product query and add missing value', () => {
        const purchaseDetails: IPurchaseDetails = { id: 456 };
        const product: IProduct = { id: 27326 };
        purchaseDetails.product = product;

        const productCollection: IProduct[] = [{ id: 84822 }];
        spyOn(productService, 'query').and.returnValue(of(new HttpResponse({ body: productCollection })));
        const additionalProducts = [product];
        const expectedCollection: IProduct[] = [...additionalProducts, ...productCollection];
        spyOn(productService, 'addProductToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ purchaseDetails });
        comp.ngOnInit();

        expect(productService.query).toHaveBeenCalled();
        expect(productService.addProductToCollectionIfMissing).toHaveBeenCalledWith(productCollection, ...additionalProducts);
        expect(comp.productsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Purchase query and add missing value', () => {
        const purchaseDetails: IPurchaseDetails = { id: 456 };
        const purchase: IPurchase = { id: 54240 };
        purchaseDetails.purchase = purchase;

        const purchaseCollection: IPurchase[] = [{ id: 33536 }];
        spyOn(purchaseService, 'query').and.returnValue(of(new HttpResponse({ body: purchaseCollection })));
        const additionalPurchases = [purchase];
        const expectedCollection: IPurchase[] = [...additionalPurchases, ...purchaseCollection];
        spyOn(purchaseService, 'addPurchaseToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ purchaseDetails });
        comp.ngOnInit();

        expect(purchaseService.query).toHaveBeenCalled();
        expect(purchaseService.addPurchaseToCollectionIfMissing).toHaveBeenCalledWith(purchaseCollection, ...additionalPurchases);
        expect(comp.purchasesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const purchaseDetails: IPurchaseDetails = { id: 456 };
        const product: IProduct = { id: 39179 };
        purchaseDetails.product = product;
        const purchase: IPurchase = { id: 87764 };
        purchaseDetails.purchase = purchase;

        activatedRoute.data = of({ purchaseDetails });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(purchaseDetails));
        expect(comp.productsSharedCollection).toContain(product);
        expect(comp.purchasesSharedCollection).toContain(purchase);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const purchaseDetails = { id: 123 };
        spyOn(purchaseDetailsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ purchaseDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: purchaseDetails }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(purchaseDetailsService.update).toHaveBeenCalledWith(purchaseDetails);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const purchaseDetails = new PurchaseDetails();
        spyOn(purchaseDetailsService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ purchaseDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: purchaseDetails }));
        saveSubject.complete();

        // THEN
        expect(purchaseDetailsService.create).toHaveBeenCalledWith(purchaseDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const purchaseDetails = { id: 123 };
        spyOn(purchaseDetailsService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ purchaseDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(purchaseDetailsService.update).toHaveBeenCalledWith(purchaseDetails);
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

      describe('trackPurchaseById', () => {
        it('Should return tracked Purchase primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackPurchaseById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
