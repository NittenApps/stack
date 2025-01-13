import { Routes } from '@angular/router';
import { faBrowser, faCogs, faInputPipe, faList, faObjectGroup } from '@fortawesome/pro-duotone-svg-icons';
import { NavItem } from '@nittenapps/components';
import { activityResolver } from '../resolvers/activity.resolver';
import { fieldResolver } from '../resolvers/field.resolver';
import { fieldGroupResolver } from '../resolvers/field-group.resolver';
import { catalogResolver } from '../resolvers/catalog.resolver';

export const CONFIG_ITEMS: NavItem[] = [
  {
    label: 'Configuración',
    icon: faCogs,
    iconSet: 'duo',
    roles: ['config'],
    children: [
      {
        label: 'Catálogos',
        icon: faList,
        iconSet: 'duo',
        routerLink: ['config', 'catalogs'],
      },
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
    path: 'activities',
    loadComponent: () => import('@nittenapps/activity').then((m) => m.ActivityComponent),
    data: {
      breadcrumb: 'Actividades',
      roles: ['config'],
    },
    children: [
      {
        path: '',
        loadComponent: () => import('../components/activities/list/list.component').then((m) => m.ListComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('../components/activities/detail/detail.component').then((m) => m.DetailComponent),
        resolve: { activity: activityResolver },
        data: {
          breadcrumb: {
            disabled: true,
            label: (data: any) => `${data.activity?.code || 'Nuevo'}`,
          },
        },
      },
    ],
  },
  {
    path: 'catalogs',
    loadComponent: () => import('@nittenapps/activity').then((m) => m.ActivityComponent),
    data: {
      breadcrumb: 'Catálogos',
      roles: ['config'],
    },
    children: [
      {
        path: '',
        loadComponent: () => import('../catalogs/catalogs/list/list.component').then((m) => m.ListComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('../catalogs/catalogs/detail/detail.component').then((m) => m.DetailComponent),
        resolve: { catalog: catalogResolver },
        data: {
          breadcrumb: {
            disabled: true,
            label: (data: any) => `${data.catalog?.code || 'Nuevo'}`,
          },
        },
      },
    ],
  },
  {
    path: 'field-groups',
    loadComponent: () => import('@nittenapps/activity').then((m) => m.ActivityComponent),
    data: {
      breadcrumb: 'Grupos de Campos',
      roles: ['config'],
    },
    children: [
      {
        path: '',
        loadComponent: () => import('../components/field-groups/list/list.component').then((m) => m.ListComponent),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('../components/field-groups/detail/detail.component').then((m) => m.DetailComponent),
        resolve: { fieldGroup: fieldGroupResolver },
        data: {
          breadcrumb: {
            disabled: true,
            label: (data: any) => `${data.fieldGroup?.code || 'Nuevo'}`,
          },
        },
      },
    ],
  },
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
        loadComponent: () => import('../components/fields/list/list.component').then((m) => m.ListComponent),
      },
      {
        path: ':id',
        loadComponent: () => import('../components/fields/detail/detail.component').then((m) => m.DetailComponent),
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
