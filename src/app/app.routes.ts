import { Routes } from '@angular/router'

import { DashboardComponent } from './features/dashboard/dashboard'

export const routes: Routes = [
  {
    path: 'dashboard',
    title: 'Dashboard',
    component: DashboardComponent,
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
]

