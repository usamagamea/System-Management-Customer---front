import { Component, OnDestroy, OnInit, inject } from '@angular/core';
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
   readonly #customerService = inject(CustomerService);
   readonly #countryService = inject(CountryService);
   readonly #cityService = inject(CityService);
   readonly #toastr = inject(ToastrService);
   readonly #route = inject(ActivatedRoute);
   readonly #FB = inject(FormBuilder);
   readonly #router = inject(Router);
  // DI End //
  subscription: Subscription = new Subscription();
  customerForm: FormGroup = this.initForm();
  customerModel!: Customer[];
  countries!: CountryDto[];
  customer!: CustomerDto;
  selectedValue!: number;
  customerId!: number;
  cities!: City[];

  ngOnInit(): void {
    this.loadCountries();
    this.getCustomerDetails();
  }

  private initForm(): FormGroup {
    return this.#FB.group({
      name: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      address: [null, Validators.required],
      countryId: [null, Validators.required],
      cityId: [null, Validators.required],
    });
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

  private loadCities(countryId: number) {
    this.subscription.add(
      this.#cityService.getCityByCountryID(countryId).subscribe(
        (cities: City[]) => {
          this.cities = cities;
        },
        (error) => {
          this.#toastr.error('Failed to load cities', error);
        }
      )
    );
  }

  protected onSelectionChange() {
    this.loadCities(this.selectedValue);
  }

  private getCustomerDetails() {
    this.customerId = +this.#route.snapshot.paramMap.get('id')!;
    this.getCustomerById(this.customerId);
  }
  private getCustomerById(id: number) {
    this.subscription.add(
      this.#customerService.getCustomerById(id).subscribe((customer: any) => {
        this.customerModel = customer;
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

  private addCustomer() {
    const data = this.customerForm.value;
    this.subscription.add(
      this.#customerService.addCustomer(data).subscribe(() => {
        this.#toastr.success(`${data.name} Added successfully`);
        this.#router.navigateByUrl('/table');
      })
    );
  }
  private editCustomer() {
    const data = this.customerForm.value;
    data.id = this.customerId;
    this.subscription.add(
      this.#customerService.updateCustomer(data).subscribe(() => {
        this.#toastr.info(`${data.name} Updated successfully`);
        this.#router.navigateByUrl('/table');
      })
    );
  }

  protected onSubmit() {
    const form = this.customerForm;
    if (form.valid) {
      if (this.customerId) {
        this.editCustomer();
      } else {
        this.addCustomer();
      }
    } else {
      const excludedControls = ['countryId', 'cityId'];
      Object.keys(form.controls).forEach((controlName) => {
        if (excludedControls.includes(controlName)) {
          return;
        }
        const control = form.controls[controlName];
        if (control.invalid && control.errors) {
          Object.keys(control.errors).forEach((errorName) => {
            if (errorName === 'required') {
              this.#toastr.error(`${controlName} is required`);
            }
          });
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
