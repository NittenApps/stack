import { CommonModule } from '@angular/common';
import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { StackField, StackForm, StackFormGroup, StackFormsTemplateType, StackValidationMessage } from './components';
import { StackFormsAttributes, StackFormTemplate } from './directives';
import { CoreExtension, FieldExpressionExtension, FieldFormExtension, FieldValidationExtension } from './extensions';
import { STACK_FORMS_CONFIG, StackFormBuilder, StackFormsConfig } from './services';
import { ConfigOption } from './types';

export function defaultStackFormsConfig(config: StackFormsConfig): ConfigOption {
  return {
    types: [
      { name: 'nas-form-group', component: StackFormGroup },
      { name: 'nas-form-template', component: StackFormsTemplateType },
    ],
    extensions: [
      { name: 'core', extension: new CoreExtension(config), priority: -250 },
      { name: 'field-validation', extension: new FieldValidationExtension(config), priority: -200 },
      { name: 'field-form', extension: new FieldFormExtension(), priority: -150 },
      { name: 'field-expression', extension: new FieldExpressionExtension(), priority: -100 },
    ],
  };
}

@NgModule({
  declarations: [
    StackField,
    StackForm,
    StackFormTemplate,
    StackFormGroup,
    StackFormsAttributes,
    StackValidationMessage,
  ],
  exports: [StackField, StackForm, StackFormTemplate, StackFormGroup, StackFormsAttributes, StackValidationMessage],
  imports: [CommonModule],
})
export class StackFormsModule {
  static forRoot(config: ConfigOption = {}): ModuleWithProviders<StackFormsModule> {
    return {
      ngModule: StackFormsModule,
      providers: [
        { provide: STACK_FORMS_CONFIG, multi: true, useFactory: defaultStackFormsConfig, deps: [StackFormsConfig] },
        { provide: STACK_FORMS_CONFIG, multi: true, useValue: config },
        StackFormsConfig,
        StackFormBuilder,
      ],
    };
  }

  static forChild(config: ConfigOption = {}): ModuleWithProviders<StackFormsModule> {
    return {
      ngModule: StackFormsModule,
      providers: [
        { provide: STACK_FORMS_CONFIG, multi: true, useFactory: defaultStackFormsConfig, deps: [StackFormsConfig] },
        { provide: STACK_FORMS_CONFIG, multi: true, useValue: config },
        StackFormBuilder,
      ],
    };
  }

  constructor(config: StackFormsConfig, @Optional() @Inject(STACK_FORMS_CONFIG) configs: ConfigOption[] = []) {
    if (!configs) {
      return;
    }

    configs.forEach((conf) => config.addConfig(conf));
  }
}
