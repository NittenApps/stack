import { HttpContextToken, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { finalize } from 'rxjs';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const loadingService = inject(LoadingService);

  if (req.context.get(SkipLoading)) {
    return next(req);
  }

  loadingService.loadingOn();

  return next(req).pipe(finalize(() => loadingService.loadingOff()));
};
