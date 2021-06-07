import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { PurchaseDetailsService } from '../service/purchase-details.service';

import { PurchaseDetailsComponent } from './purchase-details.component';

describe('Component Tests', () => {
  describe('PurchaseDetails Management Component', () => {
    let comp: PurchaseDetailsComponent;
    let fixture: ComponentFixture<PurchaseDetailsComponent>;
    let service: PurchaseDetailsService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PurchaseDetailsComponent],
      })
        .overrideTemplate(PurchaseDetailsComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PurchaseDetailsComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(PurchaseDetailsService);

      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.purchaseDetails?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
