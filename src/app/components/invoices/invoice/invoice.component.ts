import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../../services/invoice.service';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { CustomerService } from '../../../services/customer.service';
import { ICustomer, IInvoice, Product, IProduct } from '../../../models';
import { ProductService } from '../../../services/product.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {
  form: FormGroup;
  title = 'Add Invoice';
  phoneCustomer: "";
  addressCustomer: "";
  showDiv: true;
  customer: true;
  private selectUndefinedOptionValue: any;
  customerList: ICustomer[];
  productList: IProduct[];
  showDialog1;
  showDialog;

  constructor(private router: Router,private _fb: FormBuilder, private invoiceService: InvoiceService, private customerService: CustomerService, private productService: ProductService, private tostr: ToastrService){}

  ngOnInit() {
    this.customerService.getCustomers().snapshotChanges().subscribe(data => {
      this.customerList = data.map(item => <ICustomer>item.payload.toJSON());
    });
    this.productService.getProducts().snapshotChanges().subscribe(data => {
      this.productList = data.map(item => <IProduct>item.payload.toJSON());
    });
    this.initForm();
  }

  initForm(): void {
    this.form = this._fb.group({
      customer: [null, Validators.required],
      totalPrice: 0,
      purchases: this._fb.array([])
    });

    // initialize stream
    const myFormValueChanges$ = this.form.controls['purchases'].valueChanges;
    // subscribe to the stream
    myFormValueChanges$.subscribe(purchases => this.updatePurchasesAmount(purchases));
  }

  updatePurchasesAmount(purchases: any) {
    const control = <FormArray>this.form.controls['purchases'];
    let totalSum = 0;
    for (let i in purchases) {
      const amount = (purchases[i].quantity * purchases[i].product.price);
      control.at(+i).get('amount').setValue(amount, { onlySelf: true, emitEvent: false });
      // update total price
      totalSum += amount;
    }
    this.form.get('totalPrice').setValue(totalSum);
  }

  purchaseForm(product?: Product): FormGroup {
    const numberPatern = '^[0-9.,]+$';
    return this._fb.group({
      product: [product, Validators.required],
      quantity: [1, [Validators.required, Validators.pattern(numberPatern)]],
      amount: [{ value: 0, disabled: true }],
    });
  }

  money(value: number) {
    let tmoney = this.invoiceService.money(value);
    return tmoney;
  }

  public addPurchase(product: Product): void {
    const control = <FormArray>this.form.controls['purchases'];

    let add = true;
    for (let i in control.controls) {
      if (control.at(+i).get('product').value.name === product.name) {
        // control.controls[i].get('quantity').setValue(control.controls[i].controls.quantity.value + 1);
        control.at(+i).get('quantity').setValue(control.at(+i).get('quantity').value + 1);
        add = false;
      }
    }

    if (add) {
      control.push(this.purchaseForm(product));
      this.showDiv = add;
    }
  }

  private removePurchase(i: number): void {
    const control = <FormArray>this.form.controls['purchases'];
    control.removeAt(i);
  }

  resetPurchase(): void {
    this.form.controls['totalPrice'].setValue(0);
    const control = <FormArray>this.form.controls['purchases'];
    control.controls = [];
  }

  saveProduct() {
    if (this.form.valid && this.form.controls['totalPrice'].value > 0) {
      const result: IInvoice = <IInvoice>this.form.value;
      // Do useful stuff with the gathered data
      console.log(result);
      this.invoiceService.insertInvoice(result);
      this.phoneCustomer = '';
      this.addressCustomer = '';
      this.showDiv = null;
      this.tostr.success('Successs', 'Invoice Registered');
      this.initForm();
      this.router.navigate(['/invoices-list']);
    } else {
      if (this.form.controls['totalPrice'].value <= 0) {
        this.tostr.error('Error', 'Invoice not value');
      }
      else (this.tostr.error('Error', 'Invoice No Registered'));
    }
  }

  getSelectedOptionText(event) {
    this.resetPurchase();
    this.showDiv = null;
    this.phoneCustomer = event.phone;
    this.addressCustomer = event.address;
  }

}

