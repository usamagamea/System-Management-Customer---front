import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CountryComponent } from './client/components/country/country.component';
import { CityComponent } from './client/components/city/city.component';
import { CustomerComponent } from './client/components/customer/customer.component';
import { CustomerListComponent } from './client/components/customer-list/customer-list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'county',
    pathMatch: 'full',
  },
  {
    path: 'county',
    component: CountryComponent,
  },
  {
    path: 'city',
    component: CityComponent,
  },
  {
    path: 'customer',
    component: CustomerComponent,
  },
  {
    path: 'table',
    component: CustomerListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
