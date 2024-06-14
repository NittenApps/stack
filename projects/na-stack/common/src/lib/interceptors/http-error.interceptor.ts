import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { tap } from 'rxjs';
import { ErrorDialog } from '../dialogs/error/error.dialog';

export const httpErrorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const dialog = inject(MatDialog);

  return next(req).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        console.error(error);
        let message: string;
        if (error.status === 0) {
          message = 'El servicio no está disponible, intenta nuevamente más tarde';
        } else {
          message = error.error?.body?.message || 'Error desconocido';
        }
        dialog.open(ErrorDialog, { data: { message } });
      },
    })
  );
};
