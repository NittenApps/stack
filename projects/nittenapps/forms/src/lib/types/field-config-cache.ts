import { ComponentRef, ElementRef, EmbeddedViewRef, Injector, ViewContainerRef } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormGroup, ValidatorFn } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { FieldType } from '../directives';
import { StackFormsExtension } from './config';
import { StackFieldConfig, StackFormOptions } from './field-config';

export interface StackFieldConfigCache extends StackFieldConfig {
  form?: FormGroup | FormArray;
  model?: any;
  formControl?: AbstractControl & { _fields?: StackFieldConfigCache[]; _childrenErrors?: { [id: string]: Function } };
  parent?: StackFieldConfigCache;
  options?: StackFormOptionsCache;
  shareFormControl?: boolean;
  index?: number;
  _localFields?: StackFieldConfigCache[];
  _elementRefs?: ElementRef[];
  _expressions?: {
    [property: string]: {
      callback?: (ingoreCache: boolean) => boolean;
      paths?: string[];
      subscription?: Subscription | null;
      value$?: Observable<any>;
    };
  };
  _hide?: boolean;
  _validators?: ValidatorFn[];
  _asyncValidators?: AsyncValidatorFn[];
  _componentRefs?: (ComponentRef<FieldType> | EmbeddedViewRef<FieldType>)[];
  _proxyInstance?: StackFormsExtension;
  _keyPath?: {
    key: StackFieldConfig['key'];
    path: string[];
  };
}

export interface StackFormOptionsCache extends StackFormOptions {
  checkExpressions?: (field: StackFieldConfig, ingoreCache?: boolean) => void;
  _viewContainerRef?: ViewContainerRef;
  _injector?: Injector;
  _hiddenFieldsForCheck?: { field: StackFieldConfigCache; default?: boolean }[];
  _initialModel?: any;
  _detectChanges?: (field: StackFieldConfig) => void;
}
