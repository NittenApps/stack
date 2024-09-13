/**
 * @jest-environment jsdom
 */

import { Subject } from 'rxjs';
import { createBuilder, createFieldComponent, mockComponent, StackInputModule } from '@na-stack/forms/testing';
import { StackFieldConfig, StackFieldConfigCache, StackFormOptionsCache } from '../../types';

function buildField({ model, options, ...field }: StackFieldConfig): StackFieldConfigCache {
  const builder = createBuilder({
    extensions: ['core'],
    onInit: (c) =>
      c.addConfig({
        types: [
          { name: 'input', wrappers: ['form-field'], component: mockComponent({ selector: 'nas-form-test-cmp' }) },
        ],
      }),
  });

  builder.build({
    model: model || {},
    options: options as StackFormOptionsCache,
    fieldGroup: [field as StackFieldConfigCache],
  });

  return field as StackFieldConfigCache;
}

function renderComponent(field: StackFieldConfig) {
  return createFieldComponent(field, { imports: [StackInputModule] });
}

describe('Core Extension', () => {
  it('should assign default props when empty', () => {
    const field = buildField({ fieldGroup: [{ key: 'title' }, { key: 'title', type: 'input' }] });

    expect(field.fieldGroup?.[0].props).toEqual({});
    expect(field.fieldGroup?.[1].props).toEqual({ label: '', placeholder: '', disabled: false });
  });

  it('should assign default type (template, fieldGroup) when empty', () => {
    const field = buildField({ key: 'title', fieldGroup: [{ template: 'test' }] });

    expect(field.type).toEqual('nas-form-group');
    expect(field.fieldGroup?.[0].type).toEqual('nas-form-template');
  });

  describe('field defaultValue', () => {
    it('should not set the defaultValue if the model value is defined', () => {
      const field = buildField({ key: 'title', defaultValue: 'test', model: { title: 'title' } });

      expect(field.model.title).toBe('title');
    });

    it('should set the default value if the model value is not defined', () => {
      const field = buildField({ key: 'title', defaultValue: false });

      expect(field.model.title).toBeFalse();
    });

    it('should set the defaultValue for nested key', () => {
      const field = buildField({ key: 'address.city', defaultValue: 'foo' });

      expect(field.model.address).toEqual({ city: 'foo' });
    });

    it('should set the defualtValue form nested form', () => {
      const field = buildField({
        key: 'address',
        defaultValue: {},
        fieldGroup: [{ key: 'city', defaultValue: 'foo' }],
      });

      expect(field.model).toEqual({ city: 'foo' });
    });

    it('should set the defaultValue when fieldGroup is set', () => {
      const field = buildField({ key: 'address', defaultValue: { foo: 'foo' }, fieldGroup: [] });

      expect(field.model).toEqual({ foo: 'foo' });
    });

    it('fieldGroup without defaultValue', () => {
      const field = buildField({ key: 'address', fieldGroup: [] });

      expect(field.model).toBeUndefined();
    });
  });

  describe('options', () => {
    it('should init root options', () => {
      const field = buildField({ options: {} });

      expect(field.options).toEqual(
        expect.objectContaining({
          formState: {},
          showError: expect.any(Function),
          fieldChanges: expect.any(Subject),
          detectChanges: expect.any(Function),
          updateInitialValue: expect.any(Function),
          resetModel: expect.any(Function),
        })
      );
    });

    it('resetModel', () => {
      const {
        field: { model, options, form, formControl },
      } = renderComponent({
        key: 'title',
        model: { title: 'test' },
        type: 'input',
      });

      formControl?.setValue('edit title');

      expect(model.title).toEqual('edit title');

      options?.resetModel?.();

      expect(model.title).toEqual('test');
      expect(form?.value).toEqual({ title: 'test' });
    });

    it('should reset hidden fields', () => {
      const {
        field: { model, options },
      } = renderComponent({ key: 'title', type: 'input', hide: true });

      options?.resetModel?.({ title: 'test' });

      expect(model.title).toEqual('test');
    });

    it('should take account of default value on resetModel', () => {
      const {
        field: { model, options },
      } = renderComponent({ key: 'title', defaultValue: 'defaultValue' });

      expect(model.title).toEqual('defaultValue');

      options?.resetModel?.();

      expect(model.title).toEqual('defaultValue');
    });

    it('should update initial value', () => {
      const {
        field: { model, options, formControl },
      } = renderComponent({ model: { title: 'test' }, key: 'title', type: 'input' });

      formControl?.setValue('edit title');

      expect(model.title).toEqual('edit title');

      options?.updateInitialValue?.();
      options?.resetModel?.();

      expect(model.title).toEqual('edit title');

      options?.updateInitialValue?.({ title: 'custom initial value' });
      options?.resetModel?.();

      expect(model.title).toEqual('custom initial value');
    });
  });

  it('should assign parent options to children', () => {
    const field = buildField({ key: 'address', fieldGroup: [{ key: 'city' }] });

    expect(field.fieldGroup?.[0].model).toEqual(field.model);
    expect(field.fieldGroup?.[0].options).toEqual(field.options);
    expect(field.fieldGroup?.[0].parent).toEqual(field);
    expect((field.fieldGroup?.[0] as any)['index']).toEqual(0);
  });

  describe('assign model to fields', () => {
    it('with simple field', () => {
      const model = { city: 'foo' };
      const field = buildField({ key: 'city', model });

      expect(field.model).toEqual(model);
    });

    describe('with fieldGroup', () => {
      it('fieldGroup without key', () => {
        const model = { city: 'foo' };
        const field = buildField({ model, fieldGroup: [{ key: 'city' }] });

        expect(field.model).toEqual(model);
        expect(field.fieldGroup?.[0].model).toEqual(model);
      });

      it('fieldGroup with key', () => {
        const model = { address: { city: 'foo' } };
        const field = buildField({ model, key: 'address', fieldGroup: [{ key: 'city' }] });

        expect(field.model).toEqual(model.address);
        expect(field.fieldGroup?.[0].model).toEqual(model.address);
      });

      it('fieldGroup with nested key', () => {
        const model = { location: { address: { city: 'foo' } } };
        const field = buildField({ model, key: 'location.address', fieldGroup: [{ key: 'city' }] });

        expect(field.model).toEqual(model.location.address);
        expect(field.fieldGroup?.[0].model).toEqual(model.location.address);
      });
    });
  });

  describe('initialise wrappers', () => {
    it('should use an empty array if wrappers is not set', () => {
      const field = buildField({ key: 'title' });

      expect(field.wrappers).toEqual([]);
    });

    it('should add default wrappers if type is provided', () => {
      const field = buildField({ type: 'input' });

      expect(field.wrappers).toEqual(['form-field']);
    });

    it('should not override wrappers if wrappers is set', () => {
      const field = buildField({ type: 'input', wrappers: ['form-field-custom'] });

      expect(field.wrappers).toEqual(['form-field-custom']);
    });
  });

  describe('generate field id', () => {
    it('should not generate id if it is defined', () => {
      const field = buildField({ key: 'title', id: 'title_id' });

      expect(field.id).toEqual('title_id');
    });

    it('should generate id if it is not defined', () => {
      const field = buildField({ key: 'title' });

      expect(field.id).toEqual('nas_form_1__title_0');
    });

    it('should take account of field index', () => {
      const { fieldGroup } = buildField({ fieldGroup: [{ key: 'title' }, { key: 'title' }] });

      expect(fieldGroup?.[0].id).toEqual('nas_form_3__title_0');
      expect(fieldGroup?.[1].id).toEqual('nas_form_3__title_1');
    });
  });

  it('should find child field by key', () => {
    const field = buildField({
      key: 'parent',
      fieldGroup: [
        {
          key: 'child1',
          type: 'input',
        },
        {
          key: 'child2',
          type: 'input',
        },
        {
          key: 'child3',
          type: 'input',
        },
      ],
    });

    const child = field.get?.('child1');

    expect(child?.key).toEqual(field.fieldGroup?.[0].key);
  });
});
