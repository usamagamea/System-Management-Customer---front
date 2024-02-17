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
  template: `
    <h2 class="text-bold">City Form</h2>
    <body class="d-flex justify-content-center ">
      <form [formGroup]="cityForm" (ngSubmit)="onSubmit()">
        <div class="row w-100">
          <mat-form-field appearance="fill">
            <mat-label>Country</mat-label>
            <mat-select matNativeControl formControlName="countryId" required>
              <mat-option
                *ngFor="let country of countries"
                [value]="country.id"
              >
                {{ country.name }}
              </mat-option>
            </mat-select>
            <mat-error *ngIf="cityForm.get('countryId')?.hasError('required')"
              >Country is <strong>required</strong></mat-error
            >
          </mat-form-field>

          <mat-form-field class="example-full-width" appearance="fill">
            <mat-label>City</mat-label>
            <input
              type="text"
              placeholder="Select City"
              aria-label="text"
              matInput
              formControlName="name"
              [matAutocomplete]="auto"
            />
            <mat-autocomplete
              #auto="matAutocomplete"
              (optionSelected)="onOptionSelected($event)"
              [displayWith]="displayFn"
            >
              <mat-option
                *ngFor="let option of filteredOptions | async"
                [value]="option"
              >
                {{ option.name }}
              </mat-option>
            </mat-autocomplete>
            <mat-error *ngIf="cityForm.get('name')?.hasError('required')"
              >City is <strong>required</strong></mat-error
            >
          </mat-form-field>

          <div class=" d-flex justify-content-center">
            <button
              type="submit"
              class="w-25"
              mat-raised-button
              [color]="show ? null : 'primary'"
              [routerLink]="show ? '/customer' : null"
              [disabled]="cityForm.invalid"
            >
              {{ show ? 'Next' : 'Save' }}
            </button>
          </div>
        </div>
      </form>
    </body>
  `,
})
export class CityComponent implements OnInit, OnDestroy {
  // DI Start //
  private readonly router = inject(Router);
  private readonly FB = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly cityService = inject(CityService);
  private readonly countryService = inject(CountryService);
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

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedCity: City = event.option.value;
    this.show = selectedCity.id !== undefined;
  }
  displayFn(city: City): string {
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
      this.countryService.getCountry().subscribe(
        (countries: CountryDto[]) => {
          this.countries = countries;
        },
        (error) => {
          this.toastr.error('Failed to load countries', error);
        }
      )
    );
  }

  private loadCities() {
    this.subscription.add(
      this.cityService.getCity().subscribe(
        (cities: City[]) => {
          this.cities = cities;
          this.filterOptions();
        },
        (error) => {
          this.toastr.error('Failed to load cities', error);
        }
      )
    );
  }

  private initForm(): FormGroup {
    return this.FB.group({
      countryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
    });
  }

  onSubmit() {
    if (this.cityForm.valid) {
      const data = this.cityForm.value;
      this.subscription.add(
        this.cityService.addCity(data).subscribe(() => {
          this.toastr.success('City Added Successfully');
          this.loadCities();
          this.router.navigateByUrl('/customer');
        })
      );
    } else {
      this.toastr.error('Please enter felids');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
