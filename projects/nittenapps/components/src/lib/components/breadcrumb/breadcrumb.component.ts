import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { BreadcrumbService } from '../../services';
import { Breadcrumb } from '../../types/breadcrumb';

@Component({
  selector: 'nas-breadcrumb',
  standalone: true,
  imports: [AsyncPipe, MatIconModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;

  constructor(breadcrumbService: BreadcrumbService) {
    this.breadcrumbs$ = breadcrumbService.breadcrumbs$;
  }
}
