import { Injectable, Injector, Optional, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup, FormGroupDirective } from '@angular/forms';
import { StackFieldConfig, StackFieldConfigCache, StackFormOptionsCache } from '../types';
import { defineHiddenProp, disableTreeValidityCall, isHiddenField, observe } from '../utils';
import { StackFormsConfig } from './form-config.service';

@Injectable({
  providedIn: 'root',
})
export class StackFormBuilder {
  constructor(
    private config: StackFormsConfig,
    private injector: Injector | null,
    @Optional() private viewContainerRef: ViewContainerRef | null,
    @Optional() private parentForm: FormGroupDirective | null
  ) {}

  build(field: StackFieldConfigCache): void {
    if (!this.config.extensions['core']) {
      throw new Error('StackForm: missing `forRoot()` call');
    }

    if (!field.parent) {
      this._setOptions(field);
    }

    disableTreeValidityCall(field.form, () => {
      this._build(field);
      if (!field.parent || field.fieldArray) {
        const options = field.options;

        if (field.parent && isHiddenField(field as StackFieldConfig)) {
          // when hide is used in expression set defaul value will not be set until detect hide changes
          // which causes default value not set on new item is added
          options?._hiddenFieldsForCheck?.push(field);
        }

        options?.checkExpressions?.(field, true);
        options?._detectChanges?.(field);
      }
    });
  }

  buildForm(
    form: FormGroup | FormArray,
    fieldGroup: StackFieldConfigCache[] = [],
    model: any,
    options: StackFormOptionsCache
  ) {
    this.build({ fieldGroup, model, form, options });
  }

  private _build(field: StackFieldConfigCache) {
    if (!field) {
      return;
    }

    const extensions = Object.values(this.config.extensions);
    extensions.forEach((extension) => extension.prePopulate?.(field as StackFieldConfig));
    extensions.forEach((extension) => extension.onPopulate?.(field as StackFieldConfig));
    field.fieldGroup?.forEach((f) => this._build(f));
    extensions.forEach((extension) => extension.postPopulate?.(field as StackFieldConfig));
  }

  private _setOptions(field: StackFieldConfigCache) {
    field.form = field.form || new FormGroup({});
    field.model = field.model || {};
    field.options = field.options || {};
    const options = field.options;

    if (!options._viewContainerRef) {
      defineHiddenProp(options, '_viewContainerRef', this.viewContainerRef);
    }

    if (!options._injector) {
      defineHiddenProp(options, '_injector', this.injector);
    }

    if (!options.build) {
      options.build = ((f: StackFieldConfigCache = field) => {
        this.build(f);
        return f as StackFieldConfig;
      }) as (field?: StackFieldConfig | StackFieldConfigCache) => StackFieldConfig;
    }

    if (!options.parentForm && this.parentForm) {
      defineHiddenProp(options, 'parentForm', this.parentForm);
      observe(options, ['parentForm', 'submitted'], ({ firstChange }) => {
        if (!firstChange) {
          options.detectChanges?.(field);
        }
      });
    }
  }
}
