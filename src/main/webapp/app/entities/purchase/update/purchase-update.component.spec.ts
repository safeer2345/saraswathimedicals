jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PurchaseService } from '../service/purchase.service';
import { IPurchase, Purchase } from '../purchase.model';
import { IVender } from 'app/entities/vender/vender.model';
import { VenderService } from 'app/entities/vender/service/vender.service';

import { PurchaseUpdateComponent } from './purchase-update.component';

describe('Component Tests', () => {
  describe('Purchase Management Update Component', () => {
    let comp: PurchaseUpdateComponent;
    let fixture: ComponentFixture<PurchaseUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let purchaseService: PurchaseService;
    let venderService: VenderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PurchaseUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PurchaseUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PurchaseUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      purchaseService = TestBed.inject(PurchaseService);
      venderService = TestBed.inject(VenderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Vender query and add missing value', () => {
        const purchase: IPurchase = { id: 456 };
        const vender: IVender = { id: 55858 };
        purchase.vender = vender;

        const venderCollection: IVender[] = [{ id: 38664 }];
        spyOn(venderService, 'query').and.returnValue(of(new HttpResponse({ body: venderCollection })));
        const additionalVenders = [vender];
        const expectedCollection: IVender[] = [...additionalVenders, ...venderCollection];
        spyOn(venderService, 'addVenderToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ purchase });
        comp.ngOnInit();

        expect(venderService.query).toHaveBeenCalled();
        expect(venderService.addVenderToCollectionIfMissing).toHaveBeenCalledWith(venderCollection, ...additionalVenders);
        expect(comp.vendersSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const purchase: IPurchase = { id: 456 };
        const vender: IVender = { id: 82665 };
        purchase.vender = vender;

        activatedRoute.data = of({ purchase });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(purchase));
        expect(comp.vendersSharedCollection).toContain(vender);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const purchase = { id: 123 };
        spyOn(purchaseService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ purchase });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: purchase }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(purchaseService.update).toHaveBeenCalledWith(purchase);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const purchase = new Purchase();
        spyOn(purchaseService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ purchase });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: purchase }));
        saveSubject.complete();

        // THEN
        expect(purchaseService.create).toHaveBeenCalledWith(purchase);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const purchase = { id: 123 };
        spyOn(purchaseService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ purchase });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(purchaseService.update).toHaveBeenCalledWith(purchase);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackVenderById', () => {
        it('Should return tracked Vender primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackVenderById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
