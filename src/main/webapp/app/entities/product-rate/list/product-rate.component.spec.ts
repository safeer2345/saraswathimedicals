import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ProductRateService } from '../service/product-rate.service';

import { ProductRateComponent } from './product-rate.component';

describe('Component Tests', () => {
  describe('ProductRate Management Component', () => {
    let comp: ProductRateComponent;
    let fixture: ComponentFixture<ProductRateComponent>;
    let service: ProductRateService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ProductRateComponent],
      })
        .overrideTemplate(ProductRateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ProductRateComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ProductRateService);

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
      expect(comp.productRates?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
