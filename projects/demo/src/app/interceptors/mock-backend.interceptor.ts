import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const mockBackendInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const now = new Date();
  if (req.url.endsWith('/activity/v1/test') && req.method === 'GET') {
    const n = 10;
    const items = new Array(n)
      .fill(null)
      .map((_, i) => i + 1)
      .map((i) => ({
        id: '' + i,
        code: 'item' + i,
        name: 'Item ' + i,
        date: new Date(now.getTime() - i * (24 * 60 * 60 * 1000)),
        status: { code: '000', name: 'Estatus 000' },
        value: i * 10000,
      }));
    return of(
      new HttpResponse({
        status: 200,
        body: {
          code: 200,
          success: true,
          body: {
            items: items,
            page: 0,
            total: 1,
          },
        },
      })
    );
  }
  if (/\/activity\/v1\/test\/\d+$/.test(req.url)) {
    const id = /[^/]*$/.exec(req.url)?.[0];
    const i = Number(id);
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
              date: new Date(now.getTime() - i * (24 * 60 * 60 * 1000)),
              status: { code: '000', name: 'Estatus 000' },
              value: i * 10000,
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
