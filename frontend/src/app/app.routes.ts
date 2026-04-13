import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';
import { EmployeeDetailComponent } from './features/employees/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './features/employees/employee-form/employee-form.component';
import { EmployeeListComponent } from './features/employees/employee-list/employee-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [guestGuard]
  },
  {
    path: 'employees',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: EmployeeListComponent
      },
      {
        path: 'new',
        component: EmployeeFormComponent
      },
      {
        path: ':id',
        component: EmployeeDetailComponent
      },
      {
        path: ':id/edit',
        component: EmployeeFormComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
