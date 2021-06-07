import * as dayjs from 'dayjs';
import { IVender } from 'app/entities/vender/vender.model';
import { IPurchaseDetails } from 'app/entities/purchase-details/purchase-details.model';

export interface IPurchase {
  id?: number;
  total?: number | null;
  date?: dayjs.Dayjs | null;
  vender?: IVender | null;
  purchaseDetails?: IPurchaseDetails[] | null;
}

export class Purchase implements IPurchase {
  constructor(
    public id?: number,
    public total?: number | null,
    public date?: dayjs.Dayjs | null,
    public vender?: IVender | null,
    public purchaseDetails?: IPurchaseDetails[] | null
  ) {}
}

export function getPurchaseIdentifier(purchase: IPurchase): number | undefined {
  return purchase.id;
}
