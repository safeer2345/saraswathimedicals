import { IProduct } from 'app/entities/product/product.model';

export interface IProductRate {
  id?: number;
  price?: number | null;
  product?: IProduct | null;
}

export class ProductRate implements IProductRate {
  constructor(public id?: number, public price?: number | null, public product?: IProduct | null) {}
}

export function getProductRateIdentifier(productRate: IProductRate): number | undefined {
  return productRate.id;
}
