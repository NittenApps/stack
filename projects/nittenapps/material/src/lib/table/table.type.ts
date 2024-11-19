import { Component, OnInit, Type, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { FieldArrayType, FieldType, StackFieldConfig, ɵgetFieldValue as getFieldValue } from '@nittenapps/forms';

interface FieldsToRender {
  key: string;
  name?: string;
  type?: string | Type<FieldType<StackFieldConfig>>;
  order: number;
}

@Component({
  selector: 'nas-mat-table',
  templateUrl: './table.type.html',
})
export class StackTable extends FieldArrayType implements OnInit {
  @ViewChild('formTable', { static: true }) table!: MatTable<any>;

  dataSource: MatTableDataSource<StackFieldConfig> = new MatTableDataSource();
  fieldsToRender: FieldsToRender[] = [];
  headerFields: string[] = [];

  get displayedColumns(): string[] {
    const displayedColumns: string[] = [];
    this.fieldsToRender.forEach((f) => f.key && displayedColumns.push(f.key.toString()));

    return displayedColumns;
  }

  ngOnInit(): void {
    this.dataSource.data = this.field.fieldGroup || [];
    this.fieldsToRender = this.buildColumnInfo(this.field.fieldArray as StackFieldConfig);
  }

  buildColumnInfo(array: StackFieldConfig): FieldsToRender[] {
    const fieldsToRender: FieldsToRender[] = [];
    array.fieldGroup?.forEach((f) =>
      fieldsToRender.push({ name: f.props?.label, key: f.key!.toString(), type: f.type, order: +f.props?.['order'] })
    );

    return fieldsToRender.sort((f1, f2) => (f1.order > f2.order ? 1 : -1));
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

  getValue(field: StackFieldConfig) {
    return getFieldValue(field);
  }
}
