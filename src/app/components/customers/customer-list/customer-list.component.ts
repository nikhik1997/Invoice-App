import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/customer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  customerList: Customer[];

  constructor(public customerService: CustomerService) { }

  ngOnInit() {
    this.customerService.getCustomers().snapshotChanges().subscribe(item => {
      this.customerList = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.customerList.push(x as Customer);
      });
    });
  }

  onEdit(customer: Customer){
    this.customerService.selectedCustomer = Object.assign({},customer);
  }

  onDelete($key: string){
    this.customerService.deleteCustomer($key);
  }

}

