import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { ActivityService, ApiConfig } from '@na-stack/api';
import { BehaviorSubject, Observable, catchError, of } from 'rxjs';

export class ListDataSource<T> extends DataSource<T> {
  totalItems = 0;

  private _activity?: string;
  private activityService: ActivityService<T>;
  private listSubject = new BehaviorSubject<T[]>([]);

  set activity(activity: string) {
    this._activity = activity;
  }

  constructor(config: ApiConfig, http: HttpClient) {
    super();
    this.activityService = new ActivityService<T>(config, http);
  }

  connect(): Observable<T[]> {
    return this.listSubject.asObservable();
  }

  disconnect(): void {
    this.listSubject.complete();
  }

  loadItems(
    page?: number,
    pageSize?: number,
    sort?: string,
    filter?: { [key: string]: string | number | boolean | readonly (string | number | boolean)[] }
  ): void {
    this.activityService
      .getList(this._activity!, page, pageSize, sort, filter)
      .pipe(catchError(() => of({ code: 500, body: { items: [], page: 0, total: 0 } })))
      .subscribe((response) => {
        this.totalItems = response.body.total;
        this.listSubject.next(response.body.items);
      });
  }
}
