import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ISalesDetails, SalesDetails } from '../sales-details.model';
import { SalesDetailsService } from '../service/sales-details.service';
import { ISale } from 'app/entities/sale/sale.model';
import { SaleService } from 'app/entities/sale/service/sale.service';
import { IProduct } from 'app/entities/product/product.model';
import { ProductService } from 'app/entities/product/service/product.service';

@Component({
  selector: 'jhi-sales-details-update',
  templateUrl: './sales-details-update.component.html',
})
export class SalesDetailsUpdateComponent implements OnInit {
  isSaving = false;

  salesSharedCollection: ISale[] = [];
  productsSharedCollection: IProduct[] = [];

  editForm = this.fb.group({
    id: [],
    quantity: [],
    rate: [],
    sale: [],
    product: [],
  });

  constructor(
    protected salesDetailsService: SalesDetailsService,
    protected saleService: SaleService,
    protected productService: ProductService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ salesDetails }) => {
      this.updateForm(salesDetails);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const salesDetails = this.createFromForm();
    if (salesDetails.id !== undefined) {
      this.subscribeToSaveResponse(this.salesDetailsService.update(salesDetails));
    } else {
      this.subscribeToSaveResponse(this.salesDetailsService.create(salesDetails));
    }
  }

  trackSaleById(index: number, item: ISale): number {
    return item.id!;
  }

  trackProductById(index: number, item: IProduct): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISalesDetails>>): void {
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

  protected updateForm(salesDetails: ISalesDetails): void {
    this.editForm.patchValue({
      id: salesDetails.id,
      quantity: salesDetails.quantity,
      rate: salesDetails.rate,
      sale: salesDetails.sale,
      product: salesDetails.product,
    });

    this.salesSharedCollection = this.saleService.addSaleToCollectionIfMissing(this.salesSharedCollection, salesDetails.sale);
    this.productsSharedCollection = this.productService.addProductToCollectionIfMissing(
      this.productsSharedCollection,
      salesDetails.product
    );
  }

  protected loadRelationshipsOptions(): void {
    this.saleService
      .query()
      .pipe(map((res: HttpResponse<ISale[]>) => res.body ?? []))
      .pipe(map((sales: ISale[]) => this.saleService.addSaleToCollectionIfMissing(sales, this.editForm.get('sale')!.value)))
      .subscribe((sales: ISale[]) => (this.salesSharedCollection = sales));

    this.productService
      .query()
      .pipe(map((res: HttpResponse<IProduct[]>) => res.body ?? []))
      .pipe(
        map((products: IProduct[]) => this.productService.addProductToCollectionIfMissing(products, this.editForm.get('product')!.value))
      )
      .subscribe((products: IProduct[]) => (this.productsSharedCollection = products));
  }

  protected createFromForm(): ISalesDetails {
    return {
      ...new SalesDetails(),
      id: this.editForm.get(['id'])!.value,
      quantity: this.editForm.get(['quantity'])!.value,
      rate: this.editForm.get(['rate'])!.value,
      sale: this.editForm.get(['sale'])!.value,
      product: this.editForm.get(['product'])!.value,
    };
  }
}
