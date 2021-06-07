import { ISale } from 'app/entities/sale/sale.model';
import { IProduct } from 'app/entities/product/product.model';

export interface ISalesDetails {
  id?: number;
  quantity?: number | null;
  rate?: number | null;
  sale?: ISale | null;
  product?: IProduct | null;
}

export class SalesDetails implements ISalesDetails {
  constructor(
    public id?: number,
    public quantity?: number | null,
    public rate?: number | null,
    public sale?: ISale | null,
    public product?: IProduct | null
  ) {}
}

export function getSalesDetailsIdentifier(salesDetails: ISalesDetails): number | undefined {
  return salesDetails.id;
}
