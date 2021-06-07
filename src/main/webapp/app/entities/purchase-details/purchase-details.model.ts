import { IProduct } from 'app/entities/product/product.model';
import { IPurchase } from 'app/entities/purchase/purchase.model';

export interface IPurchaseDetails {
  id?: number;
  rate?: number | null;
  quantity?: number | null;
  product?: IProduct | null;
  purchase?: IPurchase | null;
}

export class PurchaseDetails implements IPurchaseDetails {
  constructor(
    public id?: number,
    public rate?: number | null,
    public quantity?: number | null,
    public product?: IProduct | null,
    public purchase?: IPurchase | null
  ) {}
}

export function getPurchaseDetailsIdentifier(purchaseDetails: IPurchaseDetails): number | undefined {
  return purchaseDetails.id;
}
