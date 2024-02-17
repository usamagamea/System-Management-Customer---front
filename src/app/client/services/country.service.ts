import { Injectable, inject } from '@angular/core';
import { Observable, Subscription, catchError, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country, CountryDto } from '../models/interface/county';

import { API } from '../utils/api/endpoint';
@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private subscription: Subscription = new Subscription();
  private readonly http = inject(HttpClient);

  addCountry(country: Country): Observable<Country> {
    return this.http.post<Country>(API.COUNTRY, country);
  }

  getCountry(): Observable<CountryDto[]> {
    return this.http.get<CountryDto[]>(API.COUNTRY);
  }
}
