import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IPurchase, Purchase } from '../purchase.model';
import { PurchaseService } from '../service/purchase.service';
import { IVender } from 'app/entities/vender/vender.model';
import { VenderService } from 'app/entities/vender/service/vender.service';

@Component({
  selector: 'jhi-purchase-update',
  templateUrl: './purchase-update.component.html',
})
export class PurchaseUpdateComponent implements OnInit {
  isSaving = false;

  vendersSharedCollection: IVender[] = [];

  editForm = this.fb.group({
    id: [],
    total: [],
    date: [],
    vender: [],
  });

  constructor(
    protected purchaseService: PurchaseService,
    protected venderService: VenderService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchase }) => {
      if (purchase.id === undefined) {
        const today = dayjs().startOf('day');
        purchase.date = today;
      }

      this.updateForm(purchase);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchase = this.createFromForm();
    if (purchase.id !== undefined) {
      this.subscribeToSaveResponse(this.purchaseService.update(purchase));
    } else {
      this.subscribeToSaveResponse(this.purchaseService.create(purchase));
    }
  }

  trackVenderById(index: number, item: IVender): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchase>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(purchase: IPurchase): void {
    this.editForm.patchValue({
      id: purchase.id,
      total: purchase.total,
      date: purchase.date ? purchase.date.format(DATE_TIME_FORMAT) : null,
      vender: purchase.vender,
    });

    this.vendersSharedCollection = this.venderService.addVenderToCollectionIfMissing(this.vendersSharedCollection, purchase.vender);
  }

  protected loadRelationshipsOptions(): void {
    this.venderService
      .query()
      .pipe(map((res: HttpResponse<IVender[]>) => res.body ?? []))
      .pipe(map((venders: IVender[]) => this.venderService.addVenderToCollectionIfMissing(venders, this.editForm.get('vender')!.value)))
      .subscribe((venders: IVender[]) => (this.vendersSharedCollection = venders));
  }

  protected createFromForm(): IPurchase {
    return {
      ...new Purchase(),
      id: this.editForm.get(['id'])!.value,
      total: this.editForm.get(['total'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      vender: this.editForm.get(['vender'])!.value,
    };
  }
}
