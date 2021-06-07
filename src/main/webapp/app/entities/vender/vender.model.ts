import * as dayjs from 'dayjs';
import { IPurchase } from 'app/entities/purchase/purchase.model';

export interface IVender {
  id?: number;
  name?: string;
  address?: string;
  contact?: number;
  date?: dayjs.Dayjs;
  purchases?: IPurchase[] | null;
}

export class Vender implements IVender {
  constructor(
    public id?: number,
    public name?: string,
    public address?: string,
    public contact?: number,
    public date?: dayjs.Dayjs,
    public purchases?: IPurchase[] | null
  ) {}
}

export function getVenderIdentifier(vender: IVender): number | undefined {
  return vender.id;
}
