import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import{AngularFireDatabaseModule} from 'angularfire2/database';
import{AngularFireModule} from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';

import{environment} from '../environments/environment';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { ProductsComponent } from './components/products/products.component';
import { ProductListComponent } from './components/products/product-list/product-list.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductService} from './services/product.service';
import { CategoriesComponent } from './components/categories/categories.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryComponent } from './components/categories/category/category.component';
import { CategoryService} from './services/category.service';

import { CustomersComponent } from './components/customers/customers.component';
import { CustomerListComponent } from './components/customers/customer-list/customer-list.component';
import { CustomerComponent } from './components/customers/customer/customer.component';
import { CustomerService} from './services/customer.service';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { InvoiceComponent } from './components/invoices/invoice/invoice.component';
import { InvoiceListComponent } from './components/invoices/invoice-list/invoice-list.component';
import { InvoiceService} from './services/invoice.service';

import { AuthService } from './services/auth.service';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';

import { IloginComponent } from './components/ilogin/ilogin.component';
import { PagerService } from './services/pager.service';
import { DialogComponent } from './components/dialog/dialog.component';


const appRoutes: Routes = [
  {path: 'products', canActivate: [AuthGuard], component: ProductsComponent},
  {path: 'categories', canActivate: [AuthGuard], component: CategoriesComponent},
  {path: 'customers', canActivate: [AuthGuard], component: CustomersComponent},
  {path: 'invoices', canActivate: [AuthGuard], component: InvoicesComponent},
  {path: 'invoices-list', canActivate: [AuthGuard], component: InvoiceListComponent},

  {path: 'home', canActivate: [AuthGuard], component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'ilogin', component : IloginComponent},
];

@NgModule({
  imports: [
    BrowserModule,   
    FormsModule,
    ReactiveFormsModule,     
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,   
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  declarations: [
    AppComponent,
    ProductsComponent,
    ProductListComponent,
    ProductComponent,
    CategoriesComponent,
    CategoryListComponent,
    CategoryComponent,
    CustomersComponent,
    CustomerListComponent,
    CustomerComponent,
    InvoicesComponent,
    InvoiceComponent,
    InvoiceListComponent,
    HomeComponent,
    NavbarComponent,
    IloginComponent,
    DialogComponent    
  ],   
  providers: [
    ProductService,
    CategoryService,
    CustomerService,
    InvoiceService,
    AuthService,
    AngularFireAuth,
    PagerService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
