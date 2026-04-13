import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { BackendEmployee, Employee, EmployeeInput, EmployeeSearchFilters } from '../models/employee.model';
import { GraphqlService } from './graphql.service';

interface EmployeesQueryResponse {
  getEmployees?: BackendEmployee[];
  searchEmployee?: BackendEmployee[];
}

interface EmployeeQueryResponse {
  getEmployeeById: BackendEmployee;
}

interface CreateEmployeeMutationResponse {
  addEmployee: BackendEmployee;
}

interface UpdateEmployeeMutationResponse {
  updateEmployee: BackendEmployee;
}

interface DeleteEmployeeMutationResponse {
  deleteEmployee: string;
}

interface BackendEmployeeMutationInput {
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private readonly graphqlService = inject(GraphqlService);

  getEmployees(filters?: EmployeeSearchFilters): Observable<Employee[]> {
    const hasFilters = Boolean(filters?.department || filters?.position);
    const query = hasFilters
      ? `
      query SearchEmployee($department: String, $designation: String) {
        searchEmployee(department: $department, designation: $designation) {
          _id
          first_name
          last_name
          email
          gender
          department
          designation
          salary
          date_of_joining
          employee_photo
        }
      }
    `
      : `
      query GetEmployees {
        getEmployees {
          _id
          first_name
          last_name
          email
          gender
          department
          designation
          salary
          date_of_joining
          employee_photo
        }
      }
    `;

    const variables = hasFilters
      ? {
          department: filters?.department || undefined,
          designation: filters?.position || undefined
        }
      : undefined;

    return this.graphqlService
      .execute<EmployeesQueryResponse, { department?: string; designation?: string } | undefined>(query, variables)
      .pipe(map((response) => (response.searchEmployee ?? response.getEmployees ?? []).map((employee) => this.mapEmployee(employee))));
  }

  getEmployeeById(id: string): Observable<Employee> {
    const query = `
      query GetEmployeeById($eid: ID!) {
        getEmployeeById(eid: $eid) {
          _id
          first_name
          last_name
          email
          gender
          department
          designation
          salary
          date_of_joining
          employee_photo
        }
      }
    `;

    return this.graphqlService
      .execute<EmployeeQueryResponse, { eid: string }>(query, { eid: id })
      .pipe(map((response) => this.mapEmployee(response.getEmployeeById)));
  }

  addEmployee(input: EmployeeInput): Observable<Employee> {
    const query = `
      mutation AddEmployee(
        $first_name: String!
        $last_name: String!
        $email: String!
        $gender: String!
        $designation: String!
        $salary: Float!
        $date_of_joining: String!
        $department: String!
        $employee_photo: String
      ) {
        addEmployee(
          first_name: $first_name
          last_name: $last_name
          email: $email
          gender: $gender
          designation: $designation
          salary: $salary
          date_of_joining: $date_of_joining
          department: $department
          employee_photo: $employee_photo
        ) {
          _id
          first_name
          last_name
          email
          gender
          department
          designation
          salary
          date_of_joining
          employee_photo
        }
      }
    `;

    return this.graphqlService
      .execute<CreateEmployeeMutationResponse, BackendEmployeeMutationInput>(query, this.toBackendEmployeeInput(input))
      .pipe(map((response) => this.mapEmployee(response.addEmployee)));
  }

  updateEmployee(id: string, input: EmployeeInput): Observable<Employee> {
    const query = `
      mutation UpdateEmployee($eid: ID!, $updates: EmployeeUpdateInput!) {
        updateEmployee(eid: $eid, updates: $updates) {
          _id
          first_name
          last_name
          email
          gender
          department
          designation
          salary
          date_of_joining
          employee_photo
        }
      }
    `;

    return this.graphqlService
      .execute<UpdateEmployeeMutationResponse, { eid: string; updates: BackendEmployeeMutationInput }>(query, {
        eid: id,
        updates: this.toBackendEmployeeUpdateInput(input)
      })
      .pipe(map((response) => this.mapEmployee(response.updateEmployee)));
  }

  deleteEmployee(id: string): Observable<string> {
    const query = `
      mutation DeleteEmployee($eid: ID!) {
        deleteEmployee(eid: $eid)
      }
    `;

    return this.graphqlService
      .execute<DeleteEmployeeMutationResponse, { eid: string }>(query, { eid: id })
      .pipe(map((response) => response.deleteEmployee));
  }

  private mapEmployee(employee: BackendEmployee): Employee {
    return {
      id: employee._id,
      firstName: employee.first_name,
      lastName: employee.last_name,
      email: employee.email,
      gender: employee.gender,
      department: employee.department,
      position: employee.designation,
      salary: employee.salary,
      dateOfJoining: employee.date_of_joining,
      profilePicture: employee.employee_photo ?? null
    };
  }

  private toBackendEmployeeInput(input: EmployeeInput) {
    return {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      gender: input.gender,
      designation: input.position,
      salary: input.salary,
      date_of_joining: input.dateOfJoining,
      department: input.department,
      employee_photo: input.profilePicture || undefined
    };
  }

  private toBackendEmployeeUpdateInput(input: EmployeeInput) {
    return {
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      gender: input.gender,
      designation: input.position,
      salary: input.salary,
      date_of_joining: input.dateOfJoining,
      department: input.department,
      employee_photo: input.profilePicture || undefined
    };
  }
}
