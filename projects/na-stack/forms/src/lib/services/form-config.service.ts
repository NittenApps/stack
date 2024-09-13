import { ComponentRef, Injectable, InjectionToken, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { FieldType, FieldWrapper } from '../directives';
import {
  ConfigOption,
  ExtensionOption,
  StackFieldConfig,
  StackFieldConfigCache,
  StackFieldConfigPresetProvider,
  StackFormExtension,
  TypeOption,
  ValidationMessageOption,
  ValidatorOption,
  WrapperOption,
} from '../types';
import { defineHiddenProp, reverseDeepMerge } from '../utils';

export const STACK_FORMS_CONFIG = new InjectionToken<ConfigOption[]>('STACK_FORMS_CONFIG');

@Injectable({
  providedIn: 'root',
})
export class StackFormsConfig {
  types: { [key: string]: TypeOption } = {};
  validators: { [key: string]: ValidatorOption } = {};
  wrappers: { [key: string]: WrapperOption } = {};
  messages: { [key: string]: ValidationMessageOption['message'] } = {};

  extras: NonNullable<ConfigOption['extras']> = {
    checkExpressionOn: 'modelChange',
    lazyRender: true,
    resetFieldOnHide: true,
    renderStackFieldElement: true,
    showError(field: FieldType) {
      return (
        field.formControl.invalid &&
        (field.formControl.touched || field.options?.parentForm?.submitted || !!field.field.validation?.show)
      );
    },
  };
  extensions: { [key: string]: StackFormExtension } = {};
  presets: { [key: string]: StackFieldConfig | StackFieldConfigPresetProvider } = {};

  private extensionsByPriority: Record<number, { [key: string]: StackFormExtension }> = {};

  addConfig(config: ConfigOption): void {
    if (config.types) {
      this.setType(config.types);
    }
    if (config.validators) {
      config.validators.forEach((validator) => this.setValidator(validator));
    }
    if (config.wrappers) {
      config.wrappers.forEach((wrapper) => this.setWrapper(wrapper));
    }
    if (config.validationMessages) {
      config.validationMessages.forEach((validationMessage) =>
        this.addValidatorMessage(validationMessage.name, validationMessage.message)
      );
    }
    if (config.extensions) {
      this.setSortedExtensions(config.extensions);
    }
    if (config.extras) {
      this.extras = { ...this.extras, ...config.extras };
    }
    if (config.presets) {
      this.presets = {
        ...this.presets,
        ...config.presets.reduce((acc, curr) => ({ ...acc, [curr.name]: curr.config }), {}),
      };
    }
  }

  addValidatorMessage(name: string, message: ValidationMessageOption['message']) {
    this.messages[name] = message;
  }

  /** @ignore */
  getMergedField(field: StackFieldConfigCache = {}): any {
    const type = this.getType(field.type);
    if (!type) {
      return;
    }

    if (type.defaultOptions) {
      reverseDeepMerge(field, type.defaultOptions);
    }

    const extendedDefaults = type.extends && this.getType(type.extends)?.defaultOptions;
    if (extendedDefaults) {
      reverseDeepMerge(field, extendedDefaults);
    }

    const componentRef = this.resolveFieldTypeRef(field);
    if (componentRef?.instance?.defaultOptions) {
      reverseDeepMerge(field, componentRef.instance.defaultOptions);
    }

    if (!field.wrappers && type.wrappers) {
      field.wrappers = [...type.wrappers];
    }
  }

  getType(name: StackFieldConfig['type'], throwIfNotFound = false): TypeOption | null {
    if (name instanceof Type) {
      return { component: name, name: name.prototype.constructor.name };
    }

    if (!name || !this.types[name]) {
      if (throwIfNotFound) {
        throw new Error(
          `[Stack Error] The type "${name}" could not be found. Please make sure that is registered through the StackFormsModule declaration.`
        );
      }

      return null;
    }

    this.mergeExtendedType(name!);

    return this.types[name!];
  }

  getValidator(name: string): ValidatorOption {
    if (!this.validators[name]) {
      throw new Error(
        `[Stack Error] The validator "${name}" could not be found. Please make sure that is registered through the StackFormsModule declaration.`
      );
    }

    return this.validators[name];
  }

  getValidatorMessage(
    name: string
  ): string | ((error: any, field: StackFieldConfig) => string | Observable<string>) | undefined {
    return this.messages[name];
  }

  getWrapper(name: string | Type<FieldWrapper>): WrapperOption {
    if (name instanceof Type) {
      return { component: name, name: name.prototype.constructor.name };
    }

    if (!this.wrappers[name]) {
      throw new Error(
        `[Stack Error] The wrapper "${name}" could not be found. Please make sure that is registered through the StackFormsModule declaration.`
      );
    }

    return this.wrappers[name];
  }

  /** @ignore @internal */
  resolveFieldTypeRef(field: StackFieldConfigCache = {}): ComponentRef<FieldType> | null {
    const type: (TypeOption & { _componentRef?: ComponentRef<any> }) | null = this.getType(field.type);
    if (!type) {
      return null;
    }

    if (!type.component || type._componentRef) {
      return <ComponentRef<FieldType>>type._componentRef;
    }

    const { _viewContainerRef, _injector } = field.options || {};
    if (!_viewContainerRef || !_injector) {
      return null;
    }

    const componentRef = _viewContainerRef.createComponent<FieldType>(type.component, { injector: _injector });
    defineHiddenProp(type, '_componentRef', componentRef);
    try {
      componentRef.destroy();
    } catch (e) {
      console.error(`An error ocurred while destroying the Stack Form component type "${field.type}`, e);
    }

    return type._componentRef || null;
  }

  setType(options: TypeOption | TypeOption[]): void {
    if (Array.isArray(options)) {
      options.forEach((option) => this.setType(option));
    } else {
      if (!this.types[options.name]) {
        this.types[options.name] = <TypeOption>{ name: options.name };
      }

      (['component', 'extends', 'defaultOptions', 'wrappers'] as (keyof TypeOption)[]).forEach((prop) => {
        if (options.hasOwnProperty(prop)) {
          this.types[options.name][prop] = options[prop] as any;
        }
      });
    }
  }

  setTypeWrapper(type: string, name: string) {
    if (!this.types[type]) {
      this.types[type] = <TypeOption>{};
    }
    if (!this.types[type].wrappers) {
      this.types[type].wrappers = [];
    }
    if (!this.types[type].wrappers?.includes(name)) {
      this.types[type].wrappers?.push(name);
    }
  }

  setValidator(validator: ValidatorOption) {
    this.validators[validator.name] = validator;
  }

  setWrapper(wrapper: WrapperOption): void {
    this.wrappers[wrapper.name] = wrapper;
    if (wrapper.types) {
      wrapper.types.forEach((type) => this.setTypeWrapper(type, wrapper.name));
    }
  }

  private mergeExtendedType(name: string): void {
    if (!this.types[name].extends) {
      return;
    }

    const extendedType = this.getType(this.types[name].extends);
    if (!this.types[name].component) {
      this.types[name].component = extendedType?.component;
    }

    if (!this.types[name].wrappers) {
      this.types[name].wrappers = extendedType?.wrappers;
    }
  }

  private setSortedExtensions(extensionOptions: ExtensionOption[]): void {
    extensionOptions.forEach((extensionOption) => {
      const priority = extensionOption.priority ?? 1;
      this.extensionsByPriority[priority] = {
        ...this.extensionsByPriority[priority],
        [extensionOption.name]: extensionOption.extension,
      };
    });
    this.extensions = Object.keys(this.extensionsByPriority)
      .map(Number)
      .sort((a, b) => a - b)
      .reduce((acc, prio) => ({ ...acc, ...this.extensionsByPriority[prio] }), {});
  }
}
