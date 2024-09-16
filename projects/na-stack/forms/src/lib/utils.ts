import { ChangeDetectorRef, ComponentRef, NgZone, TemplateRef, Type, ɵNoopNgZone } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { isObservable } from 'rxjs';
import { StackFieldConfig, StackFieldConfigCache } from './types';

type IObserveFn<T> = (change: { currentValue: T; previousValue?: T; firstChange: boolean }) => void;

type IObserveTarget<T> = {
  [prop: string]: any;
  _observers?: {
    [prop: string]: {
      value: T;
      onChange: IObserveFn<T>[];
    };
  };
};

export type IObserver<T> = {
  setValue: (value: T, emitEvent?: boolean) => void;
  unsubscribe: Function;
};

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

export function clone(value: any): any {
  if (
    !isObject(value) ||
    isObservable(value) ||
    value instanceof TemplateRef ||
    (value as any).changingThisBreaksApplicationSecurity ||
    ['RegExp', 'FileList', 'File', 'Blob'].indexOf(value.constructor.name) !== -1
  ) {
    return value;
  }

  if (value instanceof Set) {
    return new Set(value);
  }

  if (value instanceof Map) {
    return new Map(value);
  }

  if (value instanceof Uint8Array) {
    return new Uint8Array(value);
  }

  if (value instanceof Uint16Array) {
    return new Uint16Array(value);
  }

  if (value instanceof Uint32Array) {
    return new Uint32Array(value);
  }

  // https://github.com/moment/moment/blob/master/moment.js#L252
  if ((value as any)._isAMomentObject && isFunction((value as any).clone)) {
    return (value as any).clone();
  }

  if (value instanceof AbstractControl) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (Array.isArray(value)) {
    return value.slice(0).map((v) => clone(v));
  }

  // best way to clone a js object maybe
  // https://stackoverflow.com/questions/41474986/how-to-clone-a-javascript-es6-class-instance
  const proto = Object.getPrototypeOf(value);
  let c = Object.create(proto);
  c = Object.setPrototypeOf(c, proto);
  // need to make a deep copy so we dont use Object.assign
  // also Object.assign wont copy property descriptor exactly
  return Object.keys(value).reduce((newVal, prop) => {
    const propDesc = Object.getOwnPropertyDescriptor(value, prop);
    if (propDesc?.get) {
      Object.defineProperty(newVal, prop, propDesc);
    } else {
      newVal[prop] = clone((value as any)[prop]);
    }

    return newVal;
  }, c);
}

export function defineHiddenProp(field: any, prop: string, defaultValue: any): void {
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

    if (c.fieldGroup && (isNil(k) || key.indexOf(`${k}.`) === 0)) {
      const field = getField(c, isNil(k) ? key : key.slice(k.length + 1));
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

export function getFieldValue(field: StackFieldConfig): any {
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
  if (!hasKey(field)) {
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
  return !isNil(field.key) && field.key !== '' && (!Array.isArray(field.key) || field.key.length > 0);
}

export function isBlankString(value: any) {
  return value === '';
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function';
}

export function isHiddenField(field: StackFieldConfig): boolean {
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

// check a value is null or undefined
export function isNil(value: any): value is null | undefined {
  return value == null;
}

export function isNoopNgZone(ngZone: NgZone): boolean {
  return ngZone instanceof ɵNoopNgZone;
}

export function isObject(value: any): value is object {
  return value != null && typeof value === 'object';
}

export function isObjectAndSameType(value1: any, value2: any): boolean {
  return (
    isObject(value1) &&
    isObject(value2) &&
    Object.getPrototypeOf(value1) === Object.getPrototypeOf(value2) &&
    !(Array.isArray(value1) || Array.isArray(value2))
  );
}

export function isPromise(value: any): value is Promise<any> {
  return !!value && typeof value.then === 'function';
}

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function markFieldForCheck(field: StackFieldConfigCache): void {
  field._componentRefs?.forEach((ref: any) => {
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
  if (!o?._observers?.[prop]) {
    o!._observers![prop] = { value: target[key], onChange: [] };
  }

  const state = o!._observers![prop];
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
        delete o?._observers?.[prop];
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
    if (isObject(currentValue) && (currentValue as object).constructor.name === 'Object') {
      Object.keys(currentValue as object).forEach((prop) => {
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
      if (isNil(dest[srcArg]) || isBlankString(dest[srcArg])) {
        dest[srcArg] = clone(src[srcArg]);
      } else if (isObjectAndSameType(dest[srcArg], src[srcArg])) {
        reverseDeepMerge(dest[srcArg], src[srcArg]);
      }
    }
  });

  return dest;
}
