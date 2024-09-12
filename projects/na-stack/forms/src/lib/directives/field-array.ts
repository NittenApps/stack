import { Directive } from '@angular/core';
import { FormArray } from '@angular/forms';
import { findControl, registerControl, unregisterControl } from '../extensions/field-form/utils';
import { StackFieldConfig, StackFieldConfigCache, StackFormExtension } from '../types';
import { FieldArrayTypeConfig } from '../types/field-array-type';
import { assignFieldValue, clone, getFieldValue, hasKey } from '../utils';
import { FieldType } from './field-type';

@Directive()
export abstract class FieldArrayType<F extends StackFieldConfig = FieldArrayTypeConfig> extends FieldType<F>
  implements StackFormExtension<F> {
  onPopulate(field: F): void {
    if (hasKey(field)) {
      const control = findControl(field as StackFieldConfigCache);
      registerControl(
        field as StackFieldConfigCache,
        control ? control : new FormArray([], { updateOn: field.modelOptions?.updateOn })
      );
    }

    field.fieldGroup = field.fieldGroup || [];

    const length = Array.isArray(field.model) ? field.model.length : 0;
    if (field.fieldGroup.length > length) {
      for (let i = field.fieldGroup.length - 1; i >= length; --i) {
        unregisterControl(field.fieldGroup[i] as StackFieldConfigCache, true);
        field.fieldGroup.splice(i, 1);
      }
    }

    for (let i = field.fieldGroup.length; i < length; i++) {
      const f = { ...clone(typeof field.fieldArray === 'function' ? field.fieldArray(field) : field.fieldArray) };
      if (f.key !== null) {
        f.key = `${i}`;
      }

      field.fieldGroup.push(f);
    }
  }

  postPopulate(field: F): void {}

  add(i?: number, initialModel?: any, { markAsDirty } = { markAsDirty: true }) {
    i = i == null ? this.field.fieldGroup!.length : i;
    if (!this.model) {
      assignFieldValue(this.field as StackFieldConfigCache, []);
    }

    this.model.splice(i, 0, initialModel ? clone(initialModel) : undefined);
    this.markFieldForCheck(this.field.fieldGroup?.[i] as StackFieldConfig);
    this._build();
    markAsDirty && this.formControl.markAsDirty();
  }

  remove(i: number, { markAsDirty } = { markAsDirty: true }) {
    this.model.splice(i, 1);

    const field = this.field.fieldGroup?.[i];
    this.field.fieldGroup?.splice(i, 1);
    this.field.fieldGroup?.forEach((f, key) => this.updateArrayElementKey(f, `${key}`));
    unregisterControl(field as StackFieldConfigCache, true);
    this._build();
    markAsDirty && this.formControl.markAsDirty();
  }

  private _build() {
    const fields = (this.field as StackFieldConfigCache).formControl?._fields ?? [this.field];
    fields.forEach((f) => (this.options as any).build(f));
    this.options?.fieldChanges?.next({
      field: this.field,
      value: getFieldValue(this.field as StackFieldConfigCache),
      type: 'valueChanges',
    });
  }

  private markFieldForCheck(f: StackFieldConfig) {
    if (!f) {
      return;
    }

    f.fieldGroup?.forEach((c: any) => this.markFieldForCheck(c));
    if (f.hide === false) {
      (this.options as any)._hiddenFieldsForCheck.push(f);
    }
  }

  private updateArrayElementKey(f: StackFieldConfig, newKey: string) {
    if (hasKey(f)) {
      f.key = newKey;
      return;
    }

    if (!f.fieldGroup?.length) {
      return;
    }

    for (let i = 0; i < f.fieldGroup.length; i++) {
      this.updateArrayElementKey(f.fieldGroup[i], newKey);
    }
  }
}
