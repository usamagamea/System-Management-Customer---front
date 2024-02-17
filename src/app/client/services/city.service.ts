import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { City, CityDto } from '../models/interface/city';
import { API } from '../utils/api/endpoint';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private readonly http = inject(HttpClient);

  addCity(city: CityDto): Observable<CityDto> {
    return this.http.post<CityDto>(API.CITY, city);
  }

  getCity(): Observable<City[]> {
    return this.http.get<City[]>(API.CITY);
  }

  getCityByCountryID(id: number): Observable<CityDto[]> {
    return this.http.get<CityDto[]>(API.CITY_BY_COUNTRY_ID(id));
  }
}
