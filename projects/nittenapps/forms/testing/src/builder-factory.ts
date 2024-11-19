import {
  CoreExtension,
  FieldExpressionExtension,
  FieldFormExtension,
  FieldValidationExtension,
} from '../../src/lib/extensions';
import { StackFormBuilder, StackFormsConfig } from '../../src/lib/services';
import { StackFormsExtension } from '../../src/lib/types';
import { mockComponent } from './utils';

interface IBuilderOption {
  onInit?: (c: StackFormsConfig) => void;
  extensions?: string[];
}

export function createBuilder({ extensions, onInit }: IBuilderOption = {}): StackFormBuilder {
  const config = new StackFormsConfig();
  config.addConfig({
    types: [
      {
        name: 'nas-form-group',
        component: mockComponent({ selector: 'nas-form-group' }),
      },
      { name: 'nas-form-template', component: mockComponent({ selector: 'nas-form-template' }) },
    ],
    extensions: [
      { name: 'core', extension: new CoreExtension(config) as StackFormsExtension },
      { name: 'validation', extension: new FieldValidationExtension(config) as StackFormsExtension },
      { name: 'form', extension: new FieldFormExtension() as StackFormsExtension },
      { name: 'expression', extension: new FieldExpressionExtension() as StackFormsExtension },
    ].filter(({ name }) => !extensions || extensions.includes(name)),
  });
  onInit && onInit(config);

  return new StackFormBuilder(config, null, null, null);
}
