import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IProductRate, ProductRate } from '../product-rate.model';
import { ProductRateService } from '../service/product-rate.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-product-rate-update',
  templateUrl: './product-rate-update.component.html',
})
export class ProductRateUpdateComponent implements OnInit {
  isSaving = false;

  productsCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    price: [],
    product: [],
  });

  constructor(
    protected productRateService: ProductRateService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ productRate }) => {
      this.updateForm(productRate);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const productRate = this.createFromForm();
    if (productRate.id !== undefined) {
      this.subscribeToSaveResponse(this.productRateService.update(productRate));
    } else {
      this.subscribeToSaveResponse(this.productRateService.create(productRate));
    }
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProductRate>>): void {
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

  protected updateForm(productRate: IProductRate): void {
    this.editForm.patchValue({
      id: productRate.id,
      price: productRate.price,
      product: productRate.product,
    });

    this.productsCollection = this.productService.addProductToCollectionIfMissing(this.productsCollection, productRate.product);
  }

  protected loadRelationshipsOptions(): void {
    this.productService
      .query({ filter: 'productrate-is-null' })
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsCollection = products));
  }

  protected createFromForm(): IProductRate {
    return {
      ...new ProductRate(),
      id: this.editForm.get(['id'])!.value,
      price: this.editForm.get(['price'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
