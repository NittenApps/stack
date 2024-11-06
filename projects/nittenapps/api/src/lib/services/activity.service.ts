import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiConfig } from '../types/api-config';
import { ApiResponse } from '../types/api-response';
import { ListBody } from '../types/list-body';
import { ObjectBody } from '../types/object-body';

export class ActivityService<T> {
  constructor(private config: ApiConfig, private http: HttpClient, private activity: string) {}

  get(
    method: string,
    params: { [key: string]: string | number | boolean | readonly (string | number | boolean)[] }
  ): Observable<ApiResponse<T, ListBody<T> | ObjectBody<T>>> {
    const ps = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null));
    return this.http.get<ApiResponse<T, ListBody<T> | ObjectBody<T>>>(
      `${this.config.baseUrl}/activity/v1/${this.activity}/${method}`,
      { params: ps }
    );
  }

  getList(
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
    return this.http.get<ApiResponse<T, ListBody<T>>>(`${this.config.baseUrl}/activity/v1/${this.activity}`, {
      params,
    });
  }

  getObject(id: string): Observable<ApiResponse<T, ObjectBody<T>>> {
    return this.http.get<ApiResponse<T, ObjectBody<T>>>(`${this.config.baseUrl}/activity/v1/${this.activity}/${id}`);
  }

  save(object: T): Observable<ApiResponse<T, ObjectBody<T>>> {
    return this.http.post<ApiResponse<T, ObjectBody<T>>>(`${this.config.baseUrl}/activity/v1/${this.activity}`, object);
  }
}
