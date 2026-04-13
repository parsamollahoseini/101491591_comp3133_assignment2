export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  department: string;
  position: string;
  salary: number;
  dateOfJoining: string;
  profilePicture?: string | null;
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  department: string;
  position: string;
  salary: number;
  dateOfJoining: string;
  profilePicture?: string | null;
}

export interface EmployeeSearchFilters {
  department?: string;
  position?: string;
}

export interface BackendEmployee {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  designation: string;
  salary: number;
  date_of_joining: string;
  department: string;
  employee_photo?: string | null;
}
