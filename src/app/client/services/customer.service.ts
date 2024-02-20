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
  updateCustomer(customer: CustomerDto): Observable<CustomerDto> {
    return this.http.put<CustomerDto>(API.CUSTOMER, customer);
  }
  deleteCustomer(id: number): Observable<CustomerDto> {
    return this.http.delete<CustomerDto>(API.DELETE_CUSTOMER(id));
  }

  getCustomerById(id: number): Observable<CustomerDto> {
    return this.http.get<CustomerDto>(API.CUSTOMER_BY_ID(id));
  }
}
