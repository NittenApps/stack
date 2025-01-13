import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiConfig, ApiResponse, CatalogValue, ListBody } from '../types';
import { map, Observable } from 'rxjs';
import { Catalog } from '../types/catalog';

export class ConfigService {
  constructor(private config: ApiConfig, private http: HttpClient) {}

  getCatalogValues(
    catalogCode: string,
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }
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

  getCatalogs(
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }
  ): Observable<Catalog[]> {
    return this.http
      .get<ApiResponse<Catalog, ListBody<Catalog>>>(`${this.config.baseUrl}/config/v1/catalogs`, {
        params,
      })
      .pipe(map((response) => response.body.items));
  }
}
