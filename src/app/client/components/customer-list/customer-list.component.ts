import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { CustomerDto } from '../../models/interface/customer';
import { CustomerColumns } from '../../models/constant/columns';
import { CustomerService } from '../../services/customer.service';

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

  // DI Start //
  private readonly customerService = inject(CustomerService);
  // DI End //

  ngOnInit(): void {
    this.getCustomerList();
  }

  private getCustomerList() {
    this.subscription.add(
      this.customerService.getCustomer().subscribe({
        next: (res: CustomerDto[]) => {
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
      })
    );
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
