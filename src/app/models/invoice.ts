import {Product} from './product';
import {Customer} from './customer';

export class IInvoice {
  $key?: string;
  invoiceNumber?: number;
  createdAt?: string;
  modifiedAt?:string;
  uid?: string;

  customer: Customer;
  purchases: Purchase[];
  totalPrice: number;
}

export interface Purchase {
  product: Product;
  quantity: number;
  amount: number;
}

export interface IInvoice {
  $key?: string;
  invoiceNumber?: number;
  createdAt?: string;
  modifiedAt?:string;
  uid?: string;

  customer: Customer;
  purchases: Purchase[];
  totalPrice: number;

  status?: string;
  paymentType?: string;
}
