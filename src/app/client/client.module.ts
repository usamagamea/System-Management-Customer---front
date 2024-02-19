import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerComponent } from './components/customer/customer.component';
import { CustomerListComponent } from './components/customer-list/customer-list.component';
import { MaterialModule } from './utils/material/material.module';
import { CityComponent } from './components/city/city.component';
import { CountryComponent } from './components/country/country.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    CityComponent,
    CountryComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
  ],
  exports: [
    CustomerComponent,
    CustomerListComponent,
    CityComponent,
    CountryComponent,
  ],
})
export class ClientModule {}
