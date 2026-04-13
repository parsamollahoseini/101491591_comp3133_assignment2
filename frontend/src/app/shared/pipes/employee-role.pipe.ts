import { Pipe, PipeTransform } from '@angular/core';
import { Employee } from '../../core/models/employee.model';

@Pipe({
  name: 'employeeRole',
  standalone: true
})
export class EmployeeRolePipe implements PipeTransform {
  transform(employee: Pick<Employee, 'department' | 'position'>): string {
    return `${employee.department} / ${employee.position}`;
  }
}
