import { HttpClient } from '@angular/common/http';
import { ApiConfig, ApiResponse, CatalogValue, ListBody } from '../types';
import { map, Observable } from 'rxjs';

export class ConfigService {
  constructor(private config: ApiConfig, private http: HttpClient) {}

  getCatalogValues(
    catalogCode: string,
    params?: { [key: string]: string | number | boolean | readonly (string | number | boolean)[] }
  ): Observable<CatalogValue[]> {
    return this.http
      .get<ApiResponse<CatalogValue, ListBody<CatalogValue>>>(
        `${this.config.baseUrl}/config/v1/catalog-values/${catalogCode}`,
        {
          params,
        }
      )
      .pipe(map((response) => response.body.items));
  }
}
