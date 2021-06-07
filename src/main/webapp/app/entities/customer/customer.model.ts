import * as dayjs from 'dayjs';
import { ISale } from 'app/entities/sale/sale.model';

export interface ICustomer {
  id?: number;
  name?: string;
  address?: string;
  contact?: number;
  date?: dayjs.Dayjs;
  sales?: ISale[] | null;
}

export class Customer implements ICustomer {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public contact?: number,
    public date?: dayjs.Dayjs,
    public sales?: ISale[] | null
  ) {}
}

export function getCustomerIdentifier(customer: ICustomer): number | undefined {
  return customer.id;
}
