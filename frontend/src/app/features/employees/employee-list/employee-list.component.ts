import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeRolePipe } from '../../../shared/pipes/employee-role.pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CurrencyPipe, DatePipe, EmployeeRolePipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly filtersForm = this.formBuilder.nonNullable.group({
    department: [''],
    position: ['']
  });

  protected readonly employeeCountLabel = computed(() => `${this.employees().length} employees`);

  constructor() {
    this.loadEmployees();
  }

  protected loadEmployees(): void {
    this.errorMessage.set('');
    this.isLoading.set(true);

    this.employeeService
      .getEmployees(this.filtersForm.getRawValue())
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (employees) => this.employees.set(employees),
        error: (error: Error) => this.errorMessage.set(error.message || 'Unable to load employees.')
      });
  }

  protected clearFilters(): void {
    this.filtersForm.reset({
      department: '',
      position: ''
    });
    this.loadEmployees();
  }

  protected deleteEmployee(employee: Employee): void {
    const shouldDelete = window.confirm(`Delete ${employee.firstName} ${employee.lastName}?`);
    if (!shouldDelete) {
      return;
    }

    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => this.loadEmployees(),
      error: (error: Error) => this.errorMessage.set(error.message || 'Unable to delete employee.')
    });
  }

  protected trackByEmployeeId(_: number, employee: Employee): string {
    return employee.id;
  }

  protected openCreatePage(): void {
    void this.router.navigate(['/employees/new']);
  }
}
