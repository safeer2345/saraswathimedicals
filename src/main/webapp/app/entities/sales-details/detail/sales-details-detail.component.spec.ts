import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SalesDetailsDetailComponent } from './sales-details-detail.component';

describe('Component Tests', () => {
  describe('SalesDetails Management Detail Component', () => {
    let comp: SalesDetailsDetailComponent;
    let fixture: ComponentFixture<SalesDetailsDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SalesDetailsDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ salesDetails: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(SalesDetailsDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SalesDetailsDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load salesDetails on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.salesDetails).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
