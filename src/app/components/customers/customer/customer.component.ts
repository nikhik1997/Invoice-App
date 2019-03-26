import { Component, OnInit } from '@angular/core';

import {CustomerService} from '../../../services/customer.service';
import { NgForm } from '@angular/forms';
import { Customer } from '../../../models/customer';

import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  
  customerList: Customer[];
  constructor(public customerService: CustomerService,public tostr : ToastrService) { }

  ngOnInit() {

    this.customerService.getCustomers();
    this.resetForm();

   this.customerService.getCustomers().snapshotChanges().subscribe(item =>{
      this.customerList = [];
      item.forEach(element => {
        let x = element.payload.toJSON();
        x["$key"] = element.key;
        this.customerList.push(x as Customer);
      });
    });
  }

  onSubmit(customerForm: NgForm){
    if(customerForm.value.$key == null)
      this.customerService.insertCustomer(customerForm.value)      
    else   
      this.customerService.updateCustomer(customerForm.value);
    this.tostr.success('Submitted Successfully', 'Customer Register');  
    this.resetForm(customerForm);
  }

  resetForm(customerForm?: NgForm)
  {
    if(customerForm != null)
      customerForm.reset();
      this.customerService.selectedCustomer= new Customer();
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }


  
}

