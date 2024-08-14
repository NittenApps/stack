import { ChangeDetectorRef, ComponentRef, NgZone, TemplateRef, Type, ɵNoopNgZone } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { isObservable } from 'rxjs';
import { IObserveFn, IObserveTarget, IObserver, StackFieldConfig, StackFieldConfigCache } from './types';

export const STACK_VALIDATORS = ['required', 'pattern', 'minLength', 'maxLength', 'min', 'max'];

export function assignFieldValue(field: StackFieldConfigCache, value: any): void {
  let paths = getKeyPath(field);
  if (paths.length === 0) {
    return;
  }

  let root = field;
  while (root.parent) {
    root = root.parent;
    paths = [...getKeyPath(root), ...paths];
  }

  if (value === undefined && field.resetOnHide) {
    const k = paths.pop()!;
    const m = paths.reduce((model, path) => model[path] || {}, root.model);
    delete m[k];
    return;
  }

  assignModelValue(root.model, paths, value);
}

export function assignModelValue(model: any, paths: string[], value: any): void {
  for (let i = 0; i < paths.length - 1; i++) {
    const path = paths[i];
    if (!model[path] || !isObject(model[path])) {
      model[path] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }

    model = model[path];
  }

  model[paths[paths.length - 1]] = clone(value);
}

export function clone<T>(value: T): T {
  if (
    !isObject(value) ||
    isObservable(value) ||
    value instanceof TemplateRef ||
    /* instanceof SafeHtmlImpl */ (value as any).changingThisBreaksApplicationSecurity ||
    ['RegExp', 'FileList', 'File', 'Blob'].includes(value.constructor.name)
  ) {
    return value;
  }

  if (value instanceof Set) {
    return new Set(value) as T;
  }
  if (value instanceof Map) {
    return new Map(value) as T;
  }
  if (value instanceof Uint8Array) {
    return new Uint8Array(value) as T;
  }
  if (value instanceof Uint16Array) {
    return new Uint16Array(value) as T;
  }
  if (value instanceof Uint32Array) {
    return new Uint32Array(value) as T;
  }
  if ((value as any)._isAMomentObject && isFunction((value as any).clone)) {
    return (value as any).clone() as T;
  }
  if (value instanceof AbstractControl) {
    return null as T;
  }
  if (value instanceof Date) {
    return new Date((value as Date).getTime()) as T;
  }
  if (Array.isArray(value)) {
    return value.slice(0).map((v) => clone(v)) as T;
  }

  return Object.getOwnPropertyNames(value).reduce((newVal, prop) => {
    const propDesc = Object.getOwnPropertyDescriptor(value, prop);
    if (propDesc?.get) {
      Object.defineProperty(newVal, prop, propDesc);
    } else {
      newVal[prop] = clone((value as any)[prop]);
    }

    return newVal;
  }, Object.create(Object.getPrototypeOf(value)));
}

export function defineHiddenProp(field: any, prop: string, defaultValue: any) {
  Object.defineProperty(field, prop, { enumerable: false, writable: true, configurable: true });
  field[prop] = defaultValue;
}

export function disableTreeValidityCall(form: any, callback: Function): void {
  const _updateTreeValidity = form._updateTreeValidity.bind(form);
  form._updateTreeValidity = () => {};
  callback();
  form._updateTreeValidity = _updateTreeValidity;
}

export function getField(f: StackFieldConfig, key: StackFieldConfig['key']): StackFieldConfig | undefined {
  key = (Array.isArray(key) ? key.join('.') : key) as string;
  if (!f.fieldGroup) {
    return undefined;
  }

  for (let i = 0, len = f.fieldGroup.length; i < len; i++) {
    const c = f.fieldGroup[i];
    const k = (Array.isArray(c.key) ? c.key.join('.') : c.key) as string;
    if (k === key) {
      return c;
    }

    if (c.fieldGroup && (isNull(k) || key.indexOf(`${k}.`) === 0)) {
      const field = getField(c, isNull(k) ? key : key.slice(k.length + 1));
      if (field) {
        return field;
      }
    }
  }

  return undefined;
}

export function getFieldId(formId: string, field: StackFieldConfig, index: string | number): string {
  if (field.id) {
    return field.id;
  }
  let type = field.type;
  if (!type && field.template) {
    type = 'template';
  }

  if (type instanceof Type) {
    type = type.prototype.constructor.name;
  }

  return [formId, type, field.key, index].join('_');
}

export function getFieldValue(field: StackFieldConfigCache): any {
  let model = field.parent ? field.parent.model : field.model;
  for (const path of getKeyPath(field)) {
    if (!model) {
      return model;
    }
    model = model[path];
  }

  return model;
}

export function getKeyPath(field: StackFieldConfigCache): string[] {
  if (!hasKey(field as StackFieldConfig)) {
    return [];
  }

  /* We store the keyPath in the field for performance reasons. This function will be called frequently. */
  if (field._keyPath?.key !== field.key) {
    let path: (string | number)[] = [];
    if (typeof field.key === 'string') {
      const key = field.key.indexOf('[') === -1 ? field.key : field.key.replace(/\[(\w+)\]/g, '.$1');
      path = key.indexOf('.') !== -1 ? key.split('.') : [key];
    } else if (Array.isArray(field.key)) {
      path = field.key.slice(0);
    } else {
      path = [`${field.key}`];
    }

    defineHiddenProp(field, '_keyPath', { key: field.key, path });
  }

  return field._keyPath!.path.slice(0);
}

export function hasKey(field: StackFieldConfig): boolean {
  return !isBlank(field.key) && (!Array.isArray(field.key) || field.key.length > 0);
}

export function isBlank(value: any): boolean {
  return value === undefined || value === null || value === '';
}

export function isFunction(value: any) {
  return typeof value === 'function';
}

export function isHiddenField(field: StackFieldConfig) {
  const isHidden = (f: StackFieldConfig) => f.hide || f.expressions?.['hide'];
  let setDefaultValue = !field.resetOnHide || !isHidden(field);
  if (!isHidden(field) && field.resetOnHide) {
    let parent = field.parent;
    while (parent && !isHidden(parent)) {
      parent = parent.parent;
    }
    setDefaultValue = !parent || !isHidden(parent);
  }

  return !setDefaultValue;
}

export function isNoopNgZone(ngZone: NgZone) {
  return ngZone instanceof ɵNoopNgZone;
}

export function isNull(value: any): value is undefined | null {
  return value === undefined || value === null;
}

export function isObject(value: any): value is object {
  return !isNull(value) && typeof value === 'object';
}

export function isObjectAndSameType(obj1: any, obj2: any): boolean {
  return (
    isObject(obj1) &&
    isObject(obj2) &&
    Object.getPrototypeOf(obj1) === Object.getPrototypeOf(obj2) &&
    !(Array.isArray(obj1) || Array.isArray(obj2))
  );
}

export function isPromise(value: any): value is Promise<any> {
  return !!value && typeof value.then === 'function';
}

export function markFieldForCheck(field: StackFieldConfigCache) {
  field._componentRefs?.forEach((ref) => {
    // NOTE: we cannot use ref.changeDetectorRef, see https://github.com/ngx-formly/ngx-formly/issues/2191
    if (ref instanceof ComponentRef) {
      const changeDetectorRef = ref.injector.get(ChangeDetectorRef);
      changeDetectorRef.markForCheck();
    } else {
      ref.markForCheck();
    }
  });
}

export function observe<T = any>(o: IObserveTarget<T>, paths: string[], setFn?: IObserveFn<T>): IObserver<T> {
  if (!o._observers) {
    defineHiddenProp(o, '_observers', {});
  }

  let target = o;
  for (let i = 0; i < paths.length - 1; i++) {
    if (!target[paths[i]] || !isObject(target[paths[i]])) {
      target[paths[i]] = /^\d+$/.test(paths[i + 1]) ? [] : {};
    }
    target = target[paths[i]];
  }

  const key = paths[paths.length - 1];
  const prop = paths.join('.');
  if (!o._observers![prop]) {
    o._observers![prop] = { value: target[key], onChange: [] };
  }

  const state = o._observers![prop];
  if (target[key] !== state.value) {
    state.value = target[key];
  }

  if (setFn && state.onChange.indexOf(setFn) === -1) {
    state.onChange.push(setFn);
    setFn({ currentValue: state.value, firstChange: true });
    if (state.onChange.length >= 1 && isObject(target)) {
      const { enumerable } = Object.getOwnPropertyDescriptor(target, key) || { enumerable: true };
      Object.defineProperty(target, key, {
        enumerable,
        configurable: true,
        get: () => state.value,
        set: (currentValue) => {
          if (currentValue !== state.value) {
            const previousValue = state.value;
            state.value = currentValue;
            state.onChange.forEach((changeFn) => changeFn({ previousValue, currentValue, firstChange: false }));
          }
        },
      });
    }
  }

  return {
    setValue(currentValue: T, emitEvent = true) {
      if (currentValue === state.value) {
        return;
      }

      const previousValue = state.value;
      state.value = currentValue;
      state.onChange.forEach((changeFn) => {
        if (changeFn !== setFn && emitEvent) {
          changeFn({ previousValue, currentValue, firstChange: false });
        }
      });
    },
    unsubscribe() {
      state.onChange = state.onChange.filter((changeFn) => changeFn !== setFn);
      if (state.onChange.length === 0) {
        delete o._observers![prop];
      }
    },
  };
}

export function observeDeep<T = any>(source: IObserveTarget<T>, paths: string[], setFn: () => void): () => void {
  let observers: Function[] = [];

  const unsubscribe = () => {
    observers.forEach((observer) => observer());
    observers = [];
  };
  const observer = observe(source, paths, ({ firstChange, currentValue }) => {
    !firstChange && setFn();

    unsubscribe();
    if (isObject(currentValue) && currentValue.constructor.name === 'Object') {
      Object.keys(currentValue).forEach((prop) => {
        observers.push(observeDeep(source, [...paths, prop], setFn));
      });
    }
  });

  return () => {
    observer.unsubscribe();
    unsubscribe();
  };
}

export function reverseDeepMerge(dest: any, ...args: any[]): any {
  args.forEach((src) => {
    for (const srcArg in src) {
      if (isNull(dest[srcArg]) || isBlank(dest[srcArg])) {
        dest[srcArg] = clone(src[srcArg]);
      } else if (isObjectAndSameType(dest[srcArg], src[srcArg])) {
        reverseDeepMerge(dest[srcArg], src[srcArg]);
      }
    }
  });
  return dest;
}
