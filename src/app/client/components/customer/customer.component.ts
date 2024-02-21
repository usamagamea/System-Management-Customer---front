import { Component, OnChanges, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import { CountryService } from '../../services/country.service';
import { CityService } from '../../services/city.service';
import { CountryDto } from '../../models/interface/county';
import { City } from '../../models/interface/city';
import { ActivatedRoute, Router } from '@angular/router';
import { Customer, CustomerDto } from '../../models/interface/customer';

@Component({
  selector: 'customer',
  templateUrl: './customer.component.html',
})
export class CustomerComponent implements OnInit, OnDestroy {
  // DI Start //
  private readonly customerService = inject(CustomerService);
  private readonly countryService = inject(CountryService);
  private readonly cityService = inject(CityService);
  private readonly toastr = inject(ToastrService);

  private readonly FB = inject(FormBuilder);
  private readonly router = inject(Router);
  constructor(private route: ActivatedRoute) {}
  // DI End//
  subscription: Subscription = new Subscription();
  customerForm: FormGroup = this.initForm();
  countries!: CountryDto[];
  customer!: CustomerDto;
  customerDTO!: Customer[];
  selectedValue!: number;
  customerId!: number;
  cities!: City[];

  ngOnInit(): void {
    this.loadCountries();
    this.customerId = +this.route.snapshot.paramMap.get('id')!;
    if (this.customerId) {
      this.getCustomerById(this.customerId);
      this.loadCountries();
    }
  }

  private initForm(): FormGroup {
    return this.FB.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      countryId: [null, Validators.required],
      cityId: [null, Validators.required],
    });
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

  private loadCities(countryId: number) {
    this.subscription.add(
      this.cityService.getCityByCountryID(countryId).subscribe(
        (cities: City[]) => {
          this.cities = cities;
        },
        (error) => {
          this.toastr.error('Failed to load cities', error);
        }
      )
    );
  }

  protected onSelectionChange() {
    this.loadCities(this.selectedValue);
  }

  private addCustomer() {
    const data = this.customerForm.value;
    this.subscription.add(
      this.customerService.addCustomer(data).subscribe(() => {
        this.toastr.success('Customer Added successfully');
        this.router.navigateByUrl('/table');
      })
    );
  }
  private editCustomer() {
    const data = this.customerForm.value;
    data.id = this.customerId;
    this.subscription.add(
      this.customerService.updateCustomer(data).subscribe(() => {
        this.toastr.info('Customer Updated successfully');
        this.router.navigateByUrl('/table');
      })
    );
  }

  private getCustomerById(id: number) {
    this.subscription.add(
      this.customerService.getCustomerById(id).subscribe((customer: any) => {
        this.customerDTO = customer;
        this.loadCities(customer.country.id);
        this.customerForm.patchValue({
          id: customer.id,
          name: customer.name,
          phoneNumber: customer.phoneNumber,
          address: customer.address,
          countryId: customer.country.id,
          cityId: customer.city.id,
        });
      })
    );
  }

  protected onSubmit() {
    if (this.customerForm.valid) {
      if (this.customerId) {
        this.editCustomer();
      } else {
        this.addCustomer();
      }
    } else {
      this.toastr.error('Please enter fields');
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
