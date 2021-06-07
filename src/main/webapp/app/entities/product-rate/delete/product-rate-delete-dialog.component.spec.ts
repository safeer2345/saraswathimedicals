jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ProductRateService } from '../service/product-rate.service';

import { ProductRateDeleteDialogComponent } from './product-rate-delete-dialog.component';

describe('Component Tests', () => {
  describe('ProductRate Management Delete Component', () => {
    let comp: ProductRateDeleteDialogComponent;
    let fixture: ComponentFixture<ProductRateDeleteDialogComponent>;
    let service: ProductRateService;
    let mockActiveModal: NgbActiveModal;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductRateDeleteDialogComponent],
        providers: [NgbActiveModal],
      })
        .overrideTemplate(ProductRateDeleteDialogComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductRateDeleteDialogComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProductRateService);
      mockActiveModal = TestBed.inject(NgbActiveModal);
    });

    describe('confirmDelete', () => {
      it('Should call delete service on confirmDelete', inject(
        [],
        fakeAsync(() => {
          // GIVEN
          spyOn(service, 'delete').and.returnValue(of({}));

          // WHEN
          comp.confirmDelete(123);
          tick();

          // THEN
          expect(service.delete).toHaveBeenCalledWith(123);
          expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
        })
      ));

      it('Should not call delete service on clear', () => {
        // GIVEN
        spyOn(service, 'delete');

        // WHEN
        comp.cancel();

        // THEN
        expect(service.delete).not.toHaveBeenCalled();
        expect(mockActiveModal.close).not.toHaveBeenCalled();
        expect(mockActiveModal.dismiss).toHaveBeenCalled();
      });
    });
  });
});
