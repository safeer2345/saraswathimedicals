import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IPurchaseDetails, PurchaseDetails } from '../purchase-details.model';
import { PurchaseDetailsService } from '../service/purchase-details.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';
import { IPurchase } from 'app/entities/purchase/purchase.model';
import { PurchaseService } from 'app/entities/purchase/service/purchase.service';

@Component({
  selector: 'jhi-purchase-details-update',
  templateUrl: './purchase-details-update.component.html',
})
export class PurchaseDetailsUpdateComponent implements OnInit {
  isSaving = false;

  productsSharedCollection: IProduct[] = [];
  purchasesSharedCollection: IPurchase[] = [];

  editForm = this.fb.group({
    id: [],
    rate: [],
    quantity: [],
    product: [],
    purchase: [],
  });

  constructor(
    protected purchaseDetailsService: PurchaseDetailsService,
    protected productService: ProductService,
    protected purchaseService: PurchaseService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ purchaseDetails }) => {
      this.updateForm(purchaseDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const purchaseDetails = this.createFromForm();
    if (purchaseDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.purchaseDetailsService.update(purchaseDetails));
    } else {
      this.subscribeToSaveResponse(this.purchaseDetailsService.create(purchaseDetails));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  trackPurchaseById(index: number, item: IPurchase): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPurchaseDetails>>): void {
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

  protected updateForm(purchaseDetails: IPurchaseDetails): void {
    this.editForm.patchValue({
      id: purchaseDetails.id,
      rate: purchaseDetails.rate,
      quantity: purchaseDetails.quantity,
      product: purchaseDetails.product,
      purchase: purchaseDetails.purchase,
    });

    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      purchaseDetails.product
    );
    this.purchasesSharedCollection = this.purchaseService.addPurchaseToCollectionIfMissing(
      this.purchasesSharedCollection,
      purchaseDetails.purchase
    );
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));

    this.purchaseService
      .query()
      .pipe(map((res: HttpResponse<IPurchase[]>) => res.body ?? []))
      .pipe(
        map((purchases: IPurchase[]) =>
          this.purchaseService.addPurchaseToCollectionIfMissing(purchases, this.editForm.get('purchase')!.value)
        )
      )
      .subscribe((purchases: IPurchase[]) => (this.purchasesSharedCollection = purchases));
  }

  protected createFromForm(): IPurchaseDetails {
    return {
      ...new PurchaseDetails(),
      id: this.editForm.get(['id'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      product: this.editForm.get(['product'])!.value,
      purchase: this.editForm.get(['purchase'])!.value,
    };
  }
}
