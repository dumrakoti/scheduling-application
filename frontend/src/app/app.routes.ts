import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RedirectGuard } from './core/guards/redirect.guard';

import { AuthComponent } from './layouts/auth/auth.component';
import { AdminComponent } from './layouts/admin/admin.component';

// lazy-load standalone component 
export const appRoutes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    component: AuthComponent,
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    // canActivate: [RedirectGuard]
  },
  {
    path: '',
    component: AdminComponent,
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
    // canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: 'page-not-found', pathMatch: 'full' }
];

