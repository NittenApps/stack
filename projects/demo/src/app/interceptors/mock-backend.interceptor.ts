import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const mockBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if (req.url.endsWith('/activity/v1/test') && req.method === 'GET') {
    return of(
      new HttpResponse({
        status: 200,
        body: {
          code: 200,
          success: true,
          body: {
            items: [
              { id: 1, code: 'item1', name: 'Item 1', date: new Date(), status: { code: '000', name: 'Estatus 000' } },
            ],
            page: 0,
            total: 1,
          },
        },
      })
    );
  }
  if (/\/activity\/v1\/test\/\d+$/.test(req.url)) {
    const id = /[^/]*$/.exec(req.url)?.[0];
    return of(
      new HttpResponse({
        status: 200,
        body: {
          code: 200,
          success: true,
          body: {
            object: {
              id: id,
              code: 'item' + id,
              name: 'Item ' + id,
              date: new Date(),
              status: { code: '000', name: 'Estatus 000' },
            },
          },
        },
      })
    );
  }
  if (/\/activity\/v1\/test\/.+$/.test(req.url)) {
    return of(
      new HttpResponse({
        status: 200,
        body: {},
      })
    );
  }
  return next(req);
};
