import { ComponentRef } from '@angular/core';
import { Subject } from 'rxjs';
import { StackFormsConfig } from '../../services';
import { StackFieldConfig, StackFieldConfigCache, StackFormsExtension, StackFormValueChangeEvent } from '../../types';
import {
  assignFieldValue,
  clone,
  defineHiddenProp,
  getField,
  getFieldId,
  getFieldValue,
  hasKey,
  isHiddenField,
  isUndefined,
  markFieldForCheck,
  observe,
  reverseDeepMerge,
} from '../../utils';

export class CoreExtension implements StackFormsExtension {
  private formId = 0;

  constructor(private config: StackFormsConfig) {}

  prePopulate(field: StackFieldConfigCache): void {
    const root = field.parent;
    this.initRootOptions(field);
    this.initFieldProps(field);
    if (root) {
      Object.defineProperty(field, 'options', { get: () => root.options, configurable: true });
      Object.defineProperty(field, 'model', {
        get: () => (hasKey(field) && field.fieldGroup ? getFieldValue(field) : root.model),
        configurable: true,
      });
    }

    Object.defineProperty(field, 'get', {
      value: (key: StackFieldConfig['key']) => getField(field, key),
      configurable: true,
    });

    this.getFieldComponentInstance(field)?.prePopulate?.(field);
  }

  onPopulate(field: StackFieldConfigCache): void {
    this.initFieldOptions(field);
    this.getFieldComponentInstance(field)?.onPopulate?.(field);
    if (field.fieldGroup) {
      field.fieldGroup.forEach((f, index) => {
        if (f) {
          Object.defineProperty(f, 'parent', { get: () => field, configurable: true });
          Object.defineProperty(f, 'index', { get: () => index, configurable: true });
        }
        this.formId++;
      });
    }
  }

  postPopulate(field: StackFieldConfigCache): void {
    this.getFieldComponentInstance(field)?.postPopulate?.(field);
  }

  private getFieldComponentInstance(field: StackFieldConfigCache) {
    const componentRefInstance = () => {
      let componentRef = this.config.resolveFieldTypeRef(field);

      const fieldComponentRef = field._componentRefs?.slice(-1)[0];
      if (
        fieldComponentRef instanceof ComponentRef &&
        fieldComponentRef?.componentType === componentRef?.componentType
      ) {
        componentRef = fieldComponentRef as any;
      }

      return componentRef?.instance as any;
    };

    if (!field._proxyInstance) {
      defineHiddenProp(
        field,
        '_proxyInstance',
        new Proxy({} as StackFormsExtension, {
          get: (_, prop) => componentRefInstance()?.[prop],
          set: (_, prop, value) => (componentRefInstance()[prop] = value),
        })
      );
    }

    return field._proxyInstance;
  }

  private initFieldOptions(field: StackFieldConfigCache) {
    reverseDeepMerge(field, {
      id: getFieldId(`nas-form_${this.formId}`, field, field.index!),
      hooks: {},
      modelOptions: {},
      validation: { messages: {} },
      props:
        !field.type || !hasKey(field)
          ? {}
          : {
              label: '',
              placeholder: '',
              disabled: false,
            },
    });

    if (this.config.extras.resetFieldOnHide && field.resetOnHide !== false) {
      field.resetOnHide = true;
    }

    if (field.type !== 'nas-form-template' && (field.template || field.expressions?.['template'])) {
      field.type = 'nas-form-template';
    }

    if (!field.type && field.fieldGroup) {
      field.type = 'nas-form-group';
    }

    if (field.type) {
      this.config.getMergedField(field);
    }

    if (
      hasKey(field) &&
      !isUndefined(field.defaultValue) &&
      isUndefined(getFieldValue(field)) &&
      !isHiddenField(field)
    ) {
      assignFieldValue(field, field.defaultValue);
    }

    field.wrappers = field.wrappers || [];
  }

  private initFieldProps(field: StackFieldConfigCache): void {
    Object.defineProperty(field, 'templateOptions', {
      get: () => field.props,
      set: (props) => (field.props = props),
      configurable: true,
    });
  }

  private initRootOptions(field: StackFieldConfigCache) {
    if (field.parent) {
      return;
    }

    const options = (field.options = field.options || {});
    field.options.formState = field.options.formState || {};
    if (!options.showError) {
      options.showError = this.config.extras.showError;
    }

    if (!options.fieldChanges) {
      defineHiddenProp(options, 'fieldChanges', new Subject<StackFormValueChangeEvent>());
    }

    if (!options._hiddenFieldsForCheck) {
      options._hiddenFieldsForCheck = [];
    }

    options._detectChanges = (f: StackFieldConfigCache) => {
      if (f._componentRefs) {
        markFieldForCheck(f);
      }

      f.fieldGroup?.forEach((f) => f && options._detectChanges?.(f));
    };

    options.detectChanges = (f: StackFieldConfigCache) => {
      f.options?.checkExpressions?.(f);
      options._detectChanges?.(f);
    };

    options.resetModel = (model?: any) => {
      model = clone(model ?? options._initialModel);
      if (field.model) {
        Object.keys(field.model).forEach((k) => delete field.model[k]);
        Object.assign(field.model, model || {});
      }

      observe(options, ['parentForm', 'submitted']).setValue(false, false);
      options.build?.(field);
      field.form?.reset(field.model);
    };

    options.updateInitialValue = (model?: any) => (options._initialModel = clone(model ?? field.model));
    field.options.updateInitialValue?.();
  }
}
