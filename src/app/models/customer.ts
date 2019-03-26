export class Customer {
  $key?: string;
  name: string;
  lastname: string;
  address: string;
  phone: number;
}

export interface ICustomer {
  key?: string;
  name: string;
  lastname: string;
  address: string;
  phone: number;
}
