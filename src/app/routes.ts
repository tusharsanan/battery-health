import { Routes } from '@angular/router';
import { directAccessGuard } from './guards/direct-access.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    title: 'Dashboard',
  },
  {
    path: 'academy-details',
    loadComponent: () =>
      import('./components/academy-details/academy-details.component').then(
        (m) => m.AcademyDetailsComponent
      ),
    canActivate: [directAccessGuard],
    title: 'Dashboard',
  },
];
