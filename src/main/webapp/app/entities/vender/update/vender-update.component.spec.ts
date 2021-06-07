jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { VenderService } from '../service/vender.service';
import { IVender, Vender } from '../vender.model';

import { VenderUpdateComponent } from './vender-update.component';

describe('Component Tests', () => {
  describe('Vender Management Update Component', () => {
    let comp: VenderUpdateComponent;
    let fixture: ComponentFixture<VenderUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let venderService: VenderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VenderUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(VenderUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VenderUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      venderService = TestBed.inject(VenderService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const vender: IVender = { id: 456 };

        activatedRoute.data = of({ vender });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(vender));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vender = { id: 123 };
        spyOn(venderService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vender });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vender }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(venderService.update).toHaveBeenCalledWith(vender);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vender = new Vender();
        spyOn(venderService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vender });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: vender }));
        saveSubject.complete();

        // THEN
        expect(venderService.create).toHaveBeenCalledWith(vender);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const vender = { id: 123 };
        spyOn(venderService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ vender });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(venderService.update).toHaveBeenCalledWith(vender);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
