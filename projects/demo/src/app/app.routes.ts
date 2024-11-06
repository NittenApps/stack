import { Data, Routes } from '@angular/router';
import { demoResolver } from './resolvers/demo.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    data: {
      breadcrumb: 'Tablero',
    },
  },
  {
    path: 'list',
    loadComponent: () => import('@nittenapps/activity').then((m) => m.ActivityComponent),
    data: {
      breadcrumb: 'Lista',
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./list/list.component').then((m) => m.ListComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('./detail/detail.component').then((m) => m.DetailComponent),
        resolve: { object: demoResolver },
        data: {
          breadcrumb: {
            disabled: true,
            label: (data: Data) => {
              return `${data['object']?.name || 'Nuevo'}`;
            },
          },
        },
      },
    ],
  },
  {
    path: '**',
    loadComponent: () => import('./not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
