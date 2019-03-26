import { Injectable } from '@angular/core';
import { Customer } from '../models/customer';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

@Injectable()
export class CustomerService {

  customerList: AngularFireList<any>;
  selectedCustomer: Customer = new Customer();

  constructor(private firebase: AngularFireDatabase) { }

  getCustomers(){
    return this.customerList = this.firebase.list('customers');
  }

  insertCustomer(customer: Customer)
  {
    this.customerList.push({
      name: customer.name,
      lastname: customer.lastname,
      phone: customer.phone,
      address: customer.address   
    });
  }

  updateCustomer(customer: Customer)
  {
    this.customerList.update(customer.$key,{
      name: customer.name,
      lastname: customer.lastname,
      phone: customer.phone,
      address: customer.address 
    });
  }

  deleteCustomer($key: string){
    this.customerList.remove($key);
  }

}
