import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Field } from '../types/field';
import { inject } from '@angular/core';
import { ActivityService, NAS_API_CONFIG } from '@nittenapps/api';
import { HttpClient } from '@angular/common/http';
import { EMPTY, map, mergeMap, of } from 'rxjs';

export const fieldResolver: ResolveFn<Field> = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const id = route.paramMap.get('id')!;
  const activityService = new ActivityService(inject(NAS_API_CONFIG), inject(HttpClient), 'configFields');

  if (id === '__NEW__') {
    return {
      active: true,
    };
  }

  return activityService.getObject(id).pipe(
    map((response) => response.body.object),
    mergeMap((field) => {
      if (field) {
        return of(field);
      }
      router.navigate(['..']);
      return EMPTY;
    })
  );
};
