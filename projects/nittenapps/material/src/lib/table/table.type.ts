import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { faPlus, faTrashCan } from '@fortawesome/pro-solid-svg-icons';
import { FieldArrayType, FieldType, StackFieldConfig, ɵgetFieldValue as getFieldValue } from '@nittenapps/forms';
import { Observable } from 'rxjs';
import { StackFieldProps } from '../form-field';

interface FieldsToRender {
  key: string;
  name?: string;
  type?: string | Type<FieldType<StackFieldConfig>>;
  order: number;
}

interface TableProps extends StackFieldProps {
  addable?: boolean;
  removable?: boolean;
  add?: () => Observable<any>;
}

export interface TableConfig extends StackFieldConfig<TableProps> {
  type: 'table' | Type<StackMatTable>;
}

@Component({
  selector: 'nas-mat-table',
  templateUrl: './table.type.html',
})
export class StackMatTable extends FieldArrayType<TableConfig> implements OnInit {
  @ViewChild('formTable', { static: true }) table!: MatTable<any>;

  faPlus = faPlus;

  dataSource: MatTableDataSource<StackFieldConfig> = new MatTableDataSource();
  fieldsToRender: FieldsToRender[] = [];
  headerFields: string[] = [];

  get displayedColumns(): string[] {
    return this.fieldsToRender.filter((f) => f.key !== '_delete' || this.props.removable).map((f) => f.key);
  }

  override onPopulate(field: TableConfig): void {
    if ((field.fieldArray as StackFieldConfig)?.fieldGroup?.[0]?.key !== '_delete') {
      (field.fieldArray as StackFieldConfig)?.fieldGroup?.splice(0, 0, {
        key: '_delete',
        type: 'button',
        props: {
          icon: faTrashCan,
          onClick: this.removeItem,
        },
      });
    }

    super.onPopulate(field);
  }

  ngOnInit(): void {
    (this.field.props as any)['remove'] = this.remove.bind(this);
    this.dataSource.data = this.field.fieldGroup || [];
    this.fieldsToRender = this.buildColumnInfo(this.field.fieldArray as StackFieldConfig);
  }

  addItem(): void {
    this.props.add?.().subscribe((newItem) => {
      if (!newItem) {
        return;
      }

      this.add(undefined, newItem);
      this.table.renderRows();
    });
  }

  getFormat(f: StackFieldConfig): string {
    if (f.props?.['format'] === 'decimal') {
      return '1.2-2';
    }
    if (f.props?.['format'] === 'integer') {
      return '1.0-0';
    }
    if (f.props?.['format'] === 'date') {
      return 'dd/MM/yyyy';
    }
    if (f.props?.['format'] === 'datetime') {
      return 'dd/MM/yyyy HH:mm';
    }
    return f.props?.['format'] || '';
  }

  getValue(field: StackFieldConfig): any {
    if (!field) {
      return undefined;
    }
    return getFieldValue(field);
  }

  override remove(i: number): void {
    super.remove(i);
    this.table.renderRows();
  }

  removeItem(field: StackFieldConfig): void {
    field.parent!.parent!.props!['remove'](+field.parent!.key!);
  }

  private buildColumnInfo(array: StackFieldConfig): FieldsToRender[] {
    const fieldsToRender: FieldsToRender[] = [];
    array.fieldGroup?.forEach((f) =>
      fieldsToRender.push({
        name: f.props?.label,
        key: f.key!.toString(),
        type: f.type,
        order: +f.props?.['order'],
      })
    );

    return fieldsToRender.sort((f1, f2) => (f1.order > f2.order ? 1 : -1));
  }
}
