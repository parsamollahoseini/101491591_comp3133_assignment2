import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Employee } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';
import { EmployeeRolePipe } from '../../../shared/pipes/employee-role.pipe';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DatePipe, EmployeeRolePipe],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent {
  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);

  protected readonly employee = signal<Employee | null>(null);
  protected readonly errorMessage = signal('');
  protected readonly isLoading = signal(true);

  constructor() {
    const employeeId = this.route.snapshot.paramMap.get('id');
    if (!employeeId) {
      this.errorMessage.set('Employee id is missing.');
      this.isLoading.set(false);
      return;
    }

    this.employeeService
      .getEmployeeById(employeeId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (employee) => this.employee.set(employee),
        error: (error: Error) => this.errorMessage.set(error.message || 'Unable to load employee details.')
      });
  }
}
