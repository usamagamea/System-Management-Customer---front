import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CustomerDto } from '../../models/interface/customer';
import { CustomerColumns } from '../../models/constant/columns';
import { CustomerService } from '../../services/customer.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
@Component({
  selector: 'customer-list',
  templateUrl: './customer-list.component.html',
})
export class CustomerListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  subscription: Subscription = new Subscription();
  dataSource!: MatTableDataSource<CustomerDto>;
  displayedColumns = CustomerColumns;
  customer!: CustomerDto;

  // DI Start //
  readonly #customerService = inject(CustomerService);
  readonly #toastr = inject(ToastrService);
  // DI End //

  ngOnInit(): void {
    this.getCustomerList();
  }

  private getCustomerList() {
    this.subscription.add(
      this.#customerService.getCustomer().subscribe({
        next: (res: CustomerDto[]) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
      })
    );
  }

  private deleteCustomer(id: number) {
    this.subscription.add(
      this.#customerService.deleteCustomer(id).subscribe({
        next: (res: CustomerDto) => {
          this.#toastr.warning(`Deleted Successfully`);
          this.getCustomerList();
        },
      })
    );
  }

  protected deleteCustomerConfirmation(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteCustomer(id);
      }
    });
  }
  protected applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
