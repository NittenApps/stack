import { Routes } from '@angular/router';
import { faBrowser, faCogs, faInputPipe, faObjectGroup } from '@fortawesome/pro-duotone-svg-icons';
import { NavItem } from '@nittenapps/components';
import { fieldResolver } from '../resolvers/field.resolver';

export const CONFIG_ITEMS: NavItem[] = [
  {
    label: 'Configuración',
    icon: faCogs,
    iconSet: 'duo',
    roles: ['config'],
    children: [
      {
        label: 'Campos',
        icon: faInputPipe,
        iconSet: 'duo',
        routerLink: ['config', 'fields'],
      },
      {
        label: 'Grupos de Campos',
        icon: faObjectGroup,
        iconSet: 'duo',
        routerLink: ['config', 'field-groups'],
      },
      {
        label: 'Actividades',
        icon: faBrowser,
        iconSet: 'duo',
        routerLink: ['config', 'activities'],
      },
    ],
  },
];

export const CONFIG_ROUTES: Routes = [
  {
    path: 'fields',
    loadComponent: () => import('@nittenapps/activity').then((m) => m.ActivityComponent),
    data: {
      breadcrumb: 'Campos',
      roles: ['config'],
    },
    children: [
      {
        path: '',
        loadComponent: () => import('../components/fields/list/list.component').then((m) => m.FieldsListComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../components/fields/detail/detail.component').then((m) => m.FieldsDetailComponent),
        resolve: { field: fieldResolver },
        data: {
          breadcrumb: {
            disabled: true,
            label: (data: any) => `${data.field?.code || 'Nuevo'}`,
          },
        },
      },
    ],
  },
];
