import { City, CityDto } from './city';
import { CountryDto } from './county';

export interface CustomerDto {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  countryId: number;
  cityId: number;
}
export interface Customer {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  country: CountryDto;
  city: City;
}
