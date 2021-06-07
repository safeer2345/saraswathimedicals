import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVender } from '../vender.model';

@Component({
  selector: 'jhi-vender-detail',
  templateUrl: './vender-detail.component.html',
})
export class VenderDetailComponent implements OnInit {
  vender: IVender | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vender }) => {
      this.vender = vender;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
