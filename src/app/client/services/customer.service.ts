import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CustomerDto } from '../models/interface/customer';
import { Observable } from 'rxjs';
import { API } from '../utils/api/endpoint';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly http = inject(HttpClient);

  addCustomer(customer: CustomerDto): Observable<CustomerDto> {
    return this.http.post<CustomerDto>(API.CUSTOMER, customer);
  }
  getCustomer(): Observable<CustomerDto[]> {
    return this.http.get<CustomerDto[]>(API.CUSTOMER);
  }
}
