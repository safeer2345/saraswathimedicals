import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IVender, Vender } from '../vender.model';
import { VenderService } from '../service/vender.service';

@Component({
  selector: 'jhi-vender-update',
  templateUrl: './vender-update.component.html',
})
export class VenderUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    address: [null, [Validators.required]],
    contact: [null, [Validators.required]],
    date: [null, [Validators.required]],
  });

  constructor(protected venderService: VenderService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vender }) => {
      if (vender.id === undefined) {
        const today = dayjs().startOf('day');
        vender.date = today;
      }

      this.updateForm(vender);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vender = this.createFromForm();
    if (vender.id !== undefined) {
      this.subscribeToSaveResponse(this.venderService.update(vender));
    } else {
      this.subscribeToSaveResponse(this.venderService.create(vender));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVender>>): void {
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

  protected updateForm(vender: IVender): void {
    this.editForm.patchValue({
      id: vender.id,
      name: vender.name,
      address: vender.address,
      contact: vender.contact,
      date: vender.date ? vender.date.format(DATE_TIME_FORMAT) : null,
    });
  }

  protected createFromForm(): IVender {
    return {
      ...new Vender(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      address: this.editForm.get(['address'])!.value,
      contact: this.editForm.get(['contact'])!.value,
      date: this.editForm.get(['date'])!.value ? dayjs(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
    };
  }
}
