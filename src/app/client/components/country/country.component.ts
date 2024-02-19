import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from '../../models/class/error.class';
import { CountryService } from '../../services/country.service';
import { Observable, Subscription, map, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CountryDto } from '../../models/interface/county';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';

@Component({
  selector: 'country',
  templateUrl: './country.component.html',
})
export class CountryComponent implements OnInit, OnDestroy {
  // DI Start //
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly toastr = inject(ToastrService);
  private readonly countryService = inject(CountryService);
  // DI End //
  matcher: MyErrorStateMatcher = new MyErrorStateMatcher();
  subscription: Subscription = new Subscription();
  filteredOptions!: Observable<CountryDto[]>;
  countryForm: FormGroup = this.initForm();
  countries!: CountryDto[];
  show!: boolean;

  ngOnInit(): void {
    this.loadCountries();
  }

  private filterOptions() {
    this.filteredOptions = this.countryForm.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.countries.slice();
      })
    );
  }

  protected displayFn(country: CountryDto): string {
    return country && country.name ? country.name : '';
  }

  protected onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedCountry: CountryDto = event.option.value;
    this.show = selectedCountry.id !== undefined;
  }
  private _filter(name: string): CountryDto[] {
    const filterValue = name.toLowerCase();

    return this.countries.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  private loadCountries() {
    this.subscription.add(
      this.countryService.getCountry().subscribe(
        (countries: CountryDto[]) => {
          this.countries = countries;
          this.filterOptions();
        },
        (error) => {
          this.toastr.error('Failed to load countries', error);
        }
      )
    );
  }

  private initForm(): FormGroup {
    return this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  protected onSubmit() {
    if (this.countryForm.valid) {
      const data = this.countryForm.value;
      this.subscription.add(
        this.countryService.addCountry(data).subscribe(() => {
          this.toastr.success('Country Added successfully');
          this.loadCountries();
          this.router.navigateByUrl('/city');
        })
      );
    } else {
      this.toastr.error('Please enter a country');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
