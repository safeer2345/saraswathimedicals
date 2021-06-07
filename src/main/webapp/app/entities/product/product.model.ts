import { IProductCategory } from 'app/entities/product-category/product-category.model';
import { IStock } from 'app/entities/stock/stock.model';
import { IProductRate } from 'app/entities/product-rate/product-rate.model';
import { ISalesDetails } from 'app/entities/sales-details/sales-details.model';
import { IPurchaseDetails } from 'app/entities/purchase-details/purchase-details.model';

export interface IProduct {
  id?: number;
  name?: string;
  imageContentType?: string | null;
  image?: string | null;
  productCategory?: IProductCategory | null;
  stock?: IStock | null;
  productRate?: IProductRate | null;
  salesDetails?: ISalesDetails[] | null;
  purchaseDetails?: IPurchaseDetails[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public name?: string,
    public imageContentType?: string | null,
    public image?: string | null,
    public productCategory?: IProductCategory | null,
    public stock?: IStock | null,
    public productRate?: IProductRate | null,
    public salesDetails?: ISalesDetails[] | null,
    public purchaseDetails?: IPurchaseDetails[] | null
  ) {}
}

export function getProductIdentifier(product: IProduct): number | undefined {
  return product.id;
}
