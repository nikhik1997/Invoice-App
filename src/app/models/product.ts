export class Product {
    $key: string;
    name: string;
    location: string;
    price: number;
    categoryS: string;
}


export interface IProduct {
  key?: string;
  name: string;
  location: string;
  price: number;
  categoryS: string;
}
