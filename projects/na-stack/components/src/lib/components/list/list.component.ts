import { NgClass, DecimalPipe, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTable, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiConfig, NAS_API_CONFIG } from '@na-stack/api';
import { merge, tap } from 'rxjs';
import { ListDataSource } from '../../datasources/list.datasource';
import { Column } from '../../types';

@Component({
  selector: 'nas-list',
  standalone: true,
  imports: [DatePipe, DecimalPipe, MatPaginatorModule, MatSortModule, MatTableModule, NgClass],
  templateUrl: './list.component.html',
})
export class ListComponent<T> implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<T>;

  @Input() activeSort?: string;
  @Input() activeSortDirection: SortDirection = 'asc';
  @Input() activity!: string;
  @Input() baseObject!: T;
  @Input() columns!: Column[];
  @Input() emptyMessage: string = 'No se encontraron registros';
  @Input() objectId: string = 'id';
  @Input() rowClass?: string | string[] | ((item: any) => string | string[]);

  dataSource: ListDataSource<T>;
  displayedColumns: string[] = [];

  constructor(
    @Inject(NAS_API_CONFIG) apiConfig: ApiConfig,
    http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.dataSource = new ListDataSource(apiConfig, http);
  }

  ngAfterViewInit(): void {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(tap(() => this.dataSource.loadItems()))
      .subscribe();
  }

  ngOnInit(): void {
    this.dataSource.activity = this.activity;
    this.columns.forEach((column) => this.displayedColumns.push(column.id));
    this.dataSource.loadItems();
  }

  getClass(item: T): string | string[] | undefined {
    if (typeof this.rowClass === 'function') {
      return this.rowClass(item);
    }
    return this.rowClass;
  }

  getNumberValue(column: Column, item: T): number | undefined {
    return this.getValue(column, item) as number;
  }

  getValue(column: Column, item: T): string | number | Date | undefined {
    if (typeof column.value === 'function') {
      return column.value(column.id, item);
    } else if (!!column.value) {
      return column.value;
    } else if (!!column.field) {
      const keys = column.field.split('.');
      var value = item;
      keys.forEach((key) => {
        if (value) {
          value = (<any>value)[key];
        }
      });
      if (typeof value === 'object') {
        return JSON.stringify(value);
      } else if (typeof value === 'string' || typeof value === 'number' || value instanceof Date) {
        return value;
      }
      return undefined;
    } else {
      return (<any>item)[column.id];
    }
  }

  showItem(item: T): void {
    this.router.navigate([(<any>item)[this.objectId]], { relativeTo: this.route });
  }
}
