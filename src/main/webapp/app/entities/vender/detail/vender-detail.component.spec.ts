import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VenderDetailComponent } from './vender-detail.component';

describe('Component Tests', () => {
  describe('Vender Management Detail Component', () => {
    let comp: VenderDetailComponent;
    let fixture: ComponentFixture<VenderDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [VenderDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ vender: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(VenderDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VenderDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load vender on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.vender).toEqual(jasmine.objectContaining({ id: 123 }));
      });
    });
  });
});
