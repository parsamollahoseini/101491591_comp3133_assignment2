import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { EmployeeInput } from '../../../core/models/employee.model';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly employeeId = this.route.snapshot.paramMap.get('id');
  protected readonly isEditMode = Boolean(this.employeeId);
  protected readonly isSubmitting = signal(false);
  protected readonly isLoading = signal(this.isEditMode);
  protected readonly errorMessage = signal('');
  protected readonly imagePreview = signal<string | null>(null);
  protected readonly employeeForm = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', [Validators.required]],
    department: ['', [Validators.required]],
    position: ['', [Validators.required]],
    salary: [1000, [Validators.required, Validators.min(1000)]],
    dateOfJoining: ['', [Validators.required]],
    profilePicture: ['']
  });

  constructor() {
    if (!this.employeeId) {
      this.isLoading.set(false);
      return;
    }

    this.employeeService
      .getEmployeeById(this.employeeId)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (employee) => {
          this.employeeForm.patchValue({
            ...employee,
            profilePicture: employee.profilePicture ?? ''
          });
          this.imagePreview.set(employee.profilePicture ?? null);
        },
        error: (error: Error) => this.errorMessage.set(error.message || 'Unable to load employee.')
      });
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      this.employeeForm.patchValue({ profilePicture: result });
      this.imagePreview.set(result);
    };
    reader.readAsDataURL(file);
  }

  protected submit(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const payload = this.employeeForm.getRawValue() as EmployeeInput;
    this.errorMessage.set('');
    this.isSubmitting.set(true);

    const request$ = this.employeeId
      ? this.employeeService.updateEmployee(this.employeeId, payload)
      : this.employeeService.addEmployee(payload);

    request$.pipe(finalize(() => this.isSubmitting.set(false))).subscribe({
      next: () => void this.router.navigate(['/employees']),
      error: (error: Error) => this.errorMessage.set(error.message || 'Unable to save employee.')
    });
  }
}
