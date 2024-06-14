import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../types/api-config';
import { ApiResponse } from '../types/api-response';
import { ListBody } from '../types/list-body';
import { ObjectBody } from '../types/object-body';

export class ActivityService<T> {
  constructor(private config: ApiConfig, private http: HttpClient) {}

  getList(
    activity: string,
    page?: number,
    pageSize?: number,
    sort?: string,
    filter?: { [key: string]: string | number | boolean | readonly (string | number | boolean)[] }
  ): Observable<ApiResponse<T, ListBody<T>>> {
    const params = { ...filter };
    if (page) {
      params['page'] = page;
    }
    if (pageSize) {
      params['pageSize'] = pageSize;
    }
    if (sort) {
      params['sort'] = sort;
    }
    return this.http.get<ApiResponse<T, ListBody<T>>>(`${this.config.baseUrl}/activity/v1/${activity}`, { params });
  }

  getObject(activity: string, id: string): Observable<ApiResponse<T, ObjectBody<T>>> {
    return this.http.get<ApiResponse<T, ObjectBody<T>>>(`${this.config.baseUrl}/activity/v1/${activity}/${id}`);
  }
}
