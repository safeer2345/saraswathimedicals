import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ProductRateDetailComponent } from './product-rate-detail.component';

describe('Component Tests', () => {
  describe('ProductRate Management Detail Component', () => {
    let comp: ProductRateDetailComponent;
    let fixture: ComponentFixture<ProductRateDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ProductRateDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ productRate: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ProductRateDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ProductRateDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load productRate on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.productRate).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
