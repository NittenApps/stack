import { AsyncPipe, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouteConfigLoadEnd, RouteConfigLoadStart, Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoadingService } from '../../services';

@Component({
  selector: 'lib-loading-indicator',
  standalone: true,
  imports: [AsyncPipe, MatProgressSpinnerModule, NgIf, NgTemplateOutlet],
  templateUrl: './loading-indicator.component.html',
  styleUrl: './loading-indicator.component.css',
})
export class LoadingIndicatorComponent {
  @Input() detectRouteTransitions = false;
  @ContentChild('loading') customLoadingIndicator: TemplateRef<any> | null = null;

  loading$: Observable<boolean>;

  constructor(private loadingService: LoadingService, private router: Router) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit(): void {
    if (this.detectRouteTransitions) {
      this.router.events
        .pipe(
          tap((event) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.loadingOn();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.loadingOff();
            }
          })
        )
        .subscribe();
    }
  }
}
