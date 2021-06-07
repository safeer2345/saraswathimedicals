import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { PurchaseDetailsDetailComponent } from './purchase-details-detail.component';

describe('Component Tests', () => {
  describe('PurchaseDetails Management Detail Component', () => {
    let comp: PurchaseDetailsDetailComponent;
    let fixture: ComponentFixture<PurchaseDetailsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [PurchaseDetailsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ purchaseDetails: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(PurchaseDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(PurchaseDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load purchaseDetails on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.purchaseDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
