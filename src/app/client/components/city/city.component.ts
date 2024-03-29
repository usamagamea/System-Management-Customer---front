import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../models/class/error.class';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { CountryService } from '../../services/country.service';
import { CountryDto } from '../../models/interface/county';
import { CityService } from '../../services/city.service';
import { City } from '../../models/interface/city';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'city',
  templateUrl: './city.component.html',
})
export class CityComponent implements OnInit, OnDestroy {
  // DI Start //
  readonly #router = inject(Router);
  readonly #FB = inject(FormBuilder);
  readonly #toastr = inject(ToastrService);
  readonly #cityService = inject(CityService);
  readonly #countryService = inject(CountryService);
  // DI End //
  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();
  subscription: Subscription = new Subscription();
  cityForm: FormGroup = this.initForm();
  filteredOptions!: Observable<City[]>;
  countries!: CountryDto[];
  cities!: City[];
  show!: boolean;

  ngOnInit(): void {
    this.loadCountries();
    this.loadCities();
  }

  private filterOptions() {
    this.filteredOptions = this.cityForm.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.cities.slice();
      })
    );
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedCity: City = event.option.value;
    this.show = selectedCity.id !== undefined;
  }
  protected displayFn(city: City): string {
    return city && city.name ? city.name : '';
  }

  private _filter(name: string): City[] {
    const filterValue = name.toLowerCase();

    return this.cities.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  private loadCountries() {
    this.subscription.add(
      this.#countryService.getCountry().subscribe(
        (countries: CountryDto[]) => {
          this.countries = countries;
        },
        (error) => {
          this.#toastr.error('Failed to load countries', error);
        }
      )
    );
  }

  private loadCities() {
    this.subscription.add(
      this.#cityService.getCity().subscribe(
        (cities: City[]) => {
          this.cities = cities;
          this.filterOptions();
        },
        (error) => {
          this.#toastr.error('Failed to load cities', error);
        }
      )
    );
  }

  private initForm(): FormGroup {
    return this.#FB.nonNullable.group({
      countryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });
  }

  private addCity(): void {
    const data = this.cityForm.value;
    this.subscription.add(
      this.#cityService.addCity(data).subscribe(
        () => {
          this.#toastr.success(`${data.name} Added Successfully`);
          this.loadCities();
          this.#router.navigateByUrl('/customer');
        },
        (error) => {
          if (error.status === 409) {
            // 409 is the status code for conflict (duplicate entry)
            this.#toastr.error(`City with name '${data.name}' already exists.`);
          } else {
            this.#toastr.error('An error occurred. Please try again later.');
          }
        }
      )
    );
  }
  protected onSubmit(): void {
    if (this.cityForm.valid) {
      this.addCity();
    } else {
      this.#toastr.error('Please enter felids');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
