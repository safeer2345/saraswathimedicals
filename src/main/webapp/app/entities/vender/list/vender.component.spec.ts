import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VenderService } from '../service/vender.service';

import { VenderComponent } from './vender.component';

describe('Component Tests', () => {
  describe('Vender Management Component', () => {
    let comp: VenderComponent;
    let fixture: ComponentFixture<VenderComponent>;
    let service: VenderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VenderComponent],
      })
        .overrideTemplate(VenderComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VenderComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VenderService);

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
      expect(comp.venders?.[0]).toEqual(jasmine.objectContaining({ id: 123 }));
    });
  });
});
