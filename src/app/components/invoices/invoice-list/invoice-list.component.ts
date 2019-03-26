import {map} from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { IInvoice } from '../../../models/invoice';
import { FormBuilder, FormArray } from '@angular/forms';
import { PagerService } from '../../../services/pager.service';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {  

  constructor(private invoiceService: InvoiceService,private _fb: FormBuilder,private ref: ChangeDetectorRef,private pagerService: PagerService) { }
  invoiceList: any[];
  showDiv: true;
  showEdit: true;
  resultform: '';
  summed;
  items: FormArray;

  form = this._fb.group({
    $key:'',
    totalPrice: 0,
    createdAt: '',
    customer: this._fb.group({
      name: '',
      lastname: '',
      phone: '',
      address: ''
    }),
    purchases: this._fb.array([]),
  });

  searchText: string = "";
  showDeletedMessage: boolean;
  showUpdatedMessage:boolean;
  private allItems: any[];
   // pager object
   pager: any = {};
   // paged items
   pagedItems: any[];

  ngOnInit() {    
    this.resultform = '';  
    this.showDiv = true;

    this.invoiceService.getInvoices().snapshotChanges().pipe(
      map(data => data.map(datum => {
        let purchases = datum.payload.toJSON()['purchases'];
        return {
          ...datum.payload.toJSON() as IInvoice,
          $key: datum.key,
          purchases: Object.keys(purchases).map(key => purchases[key])
        }
      })))
      .subscribe(data => {        
        this.invoiceList = data;
        this.setPage(1);
      });
  }  

  onEdit(invoice: IInvoice){
    this.searchText = '';
    this.form.patchValue(invoice);
    this.showDiv = null;
    this.showEdit = true;
    const purchasesFormArray = (this.form.get('purchases') as FormArray);
    while (purchasesFormArray.length) {
      purchasesFormArray.removeAt(0);
    }

    invoice.purchases.forEach(purchase => {
      purchasesFormArray.push(this._fb.group({
        product: this._fb.group(purchase.product),
        quantity: purchase.quantity})
      )});

    this.form.get('purchases').valueChanges.subscribe(values => {
      this.summed = 0;
      const ctrl = <FormArray>this.form.controls['purchases'];
      if(ctrl.length ==0){ this.form.get('totalPrice').setValue(0)}    
      ctrl.controls.forEach(x => {
      // get the price value and need to parse the input to number  
      let price = x.get('product.price').value;
      let quantity = x.get('quantity').value
      let amount = price*quantity      
      // add to total
      this.summed += amount
      this.form.get('totalPrice').setValue(this.summed);        
      this.ref.detectChanges()
    });
    })  
   }

   money(value: number) {
    let tmoney = this.invoiceService.money(value);
    return tmoney;
  }

   public removePurchase(i: number): void {
    const control = <FormArray>this.form.controls['purchases'];
    control.removeAt(i);
  }

  onDelete($key: string) {   
    this.invoiceService.deleteInvoice($key);
    this.showDeletedMessage = true;
      setTimeout(() => this.showDeletedMessage = false, 3000);
  } 

  onSubmit(){ 
    if (this.form.valid && this.form.controls['totalPrice'].value > 0) {      
    const result: IInvoice = <IInvoice>this.form.value; 
    console.log(result)
    this.invoiceService.updateInvoice(result);
    this.showUpdatedMessage = true;
      setTimeout(() => this.showUpdatedMessage = false, 3000);
      setTimeout(() =>this.removeDiv(),3500);
  }}

  removeDiv() {
    this.showDiv = true;
    this.showEdit = null;
  }

  filterCondition(customer) {  
    return customer.customer.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1 || customer.customer.lastname.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;}

   addInvoice() {
    this.showDiv = null;   
    this.showEdit = null;
  }

  setPage(page: number) { 
    if (page < 1 || page > this.pager.totalPages) {
        return;
    }
    // get pager object from service
    this.pager = this.pagerService.getPager(this.invoiceList.length, page);
    // get current page of items
    this.pagedItems = this.invoiceList.slice(this.pager.startIndex, this.pager.endIndex + 1);
  }
}

