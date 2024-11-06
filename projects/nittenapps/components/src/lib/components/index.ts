import { Provider } from '@angular/core';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { DetailToolbarComponent } from './detail-toolbar/detail-toolbar.component';
import { ListComponent } from './list/list.component';
import { ListToolbarComponent } from './list-toolbar/list-toolbar.component';
import { NavbarVerticalComponent } from './navbar/navbar-vertical.component';
import {
  NavigationCollapsibleComponent,
  NavigationComponent,
  NavigationItemComponent,
} from './navbar/navbar.component';

export {
  BreadcrumbComponent,
  DetailToolbarComponent,
  ListComponent,
  ListToolbarComponent,
  NavbarVerticalComponent,
  NavigationComponent,
  NavigationCollapsibleComponent,
  NavigationItemComponent,
};

export const COMPONENTS_COMPONENTS: Provider[] = [
  BreadcrumbComponent,
  DetailToolbarComponent,
  ListComponent,
  ListToolbarComponent,
  NavbarVerticalComponent,
  NavigationComponent,
  NavigationCollapsibleComponent,
  NavigationItemComponent,
];
