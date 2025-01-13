import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { ActivityService, NAS_API_CONFIG } from '@nittenapps/api';
import { EMPTY, map, mergeMap, of } from 'rxjs';
import { Activity } from '../types/activity';

export const activityResolver: ResolveFn<Activity> = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const id = route.paramMap.get('id')!;
  const activityService = new ActivityService(inject(NAS_API_CONFIG), inject(HttpClient), 'configActivities');

  if (id === '__NEW__') {
    return {
      active: true,
    };
  }

  return activityService.getObject(id).pipe(
    map((response) => response.body.object),
    mergeMap((activity) => {
      if (activity) {
        return of(activity);
      }
      router.navigate(['..']);
      return EMPTY;
    })
  );
};
