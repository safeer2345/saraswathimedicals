import * as dayjs from 'dayjs';
import { ICustomer } from 'app/entities/customer/customer.model';
import { ISalesDetails } from 'app/entities/sales-details/sales-details.model';

export interface ISale {
  id?: number;
  toatal?: number | null;
  date?: dayjs.Dayjs | null;
  customer?: ICustomer | null;
  salesDetails?: ISalesDetails[] | null;
}

export class Sale implements ISale {
  constructor(
    public id?: number,
    public toatal?: number | null,
    public date?: dayjs.Dayjs | null,
    public customer?: ICustomer | null,
    public salesDetails?: ISalesDetails[] | null
  ) {}
}

export function getSaleIdentifier(sale: ISale): number | undefined {
  return sale.id;
}
