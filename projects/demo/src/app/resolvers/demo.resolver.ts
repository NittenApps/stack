import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ActivityService, NAS_API_CONFIG } from '@nittenapps/api';
import { EMPTY, mergeMap, of } from 'rxjs';
import { Demo } from '../types/demo';

export const demoResolver: ResolveFn<Demo> = (route: ActivatedRouteSnapshot) => {
  const location = inject(Location);
  const activityService = new ActivityService<Demo>(inject(NAS_API_CONFIG), inject(HttpClient));
  const id = route.paramMap.get('id')!;

  if (id === '__NEW__') {
    return {};
  }
  return activityService.getObject('test', id).pipe(
    mergeMap((demo) => {
      if (demo?.body?.object) {
        return of(demo.body.object);
      }
      location.back();
      return EMPTY;
    })
  );
};
