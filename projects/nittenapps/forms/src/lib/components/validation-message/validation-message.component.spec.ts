/**
 * @jest-environment jsdom
 */

import { DebugElement } from '@angular/core';
import { createFieldComponent } from '@nittenapps/forms/testing';
import { of, Subject } from 'rxjs';
import { StackFieldConfig } from '../../types';
import { StackFormsModule } from '../../forms.module';

function validationMessageContent(query: (v: string) => DebugElement): string {
  return query('nas-validation-message').nativeElement.textContent;
}

const renderComponent = (field: StackFieldConfig) => {
  return createFieldComponent(field, {
    template: '<nas-validation-message [field]="field" />',
    imports: [
      StackFormsModule.forChild({
        validationMessages: [
          { name: 'required', message: (err, field) => `${field.props?.label} is required.` },
          { name: 'maxLength', message: 'Maximum Length Exceeded.' },
          { name: 'minLength', message: () => of('Minimum Length.') },
        ],
      }),
    ],
  });
};

describe('StackValidationMessage Component', () => {
  it('should not display message error when form is valid', () => {
    const { query } = renderComponent({ key: 'title' });

    expect(validationMessageContent(query)).toEqual('');
  });

  describe('display message error when form is invalid', () => {
    it('with a string validation message', () => {
      const { query } = renderComponent({
        key: 'title',
        defaultValue: '1234567',
        props: { maxLength: 3 },
      });

      expect(validationMessageContent(query)).toEqual('Maximum Length Exceeded.');
    });

    it('with a function validation message', () => {
      const { query, detectChanges } = renderComponent({
        key: 'title',
        props: {
          required: true,
          label: 'Title',
        },
      });
      detectChanges();

      expect(validationMessageContent(query)).toEqual('Title is required.');
    });

    it('with an observable validation message', () => {
      const { query, detectChanges } = renderComponent({
        key: 'title',
        defaultValue: '1',
        props: { minLength: 5 },
      });
      detectChanges();

      expect(validationMessageContent(query)).toEqual('Minimum Length.');
    });

    it('with a `validator.message` property', () => {
      const { query } = renderComponent({
        key: 'title',
        validators: {
          required: {
            expression: () => false,
            message: 'Custom error message.',
          },
        },
      });

      expect(validationMessageContent(query)).toEqual('Custom error message.');
    });

    it('should handle expressions changes', () => {
      const { query } = renderComponent({
        key: 'title',
        validators: {
          required: {
            expression: () => false,
            message: 'Custom error message.',
          },
        },
      });

      expect(validationMessageContent(query)).toEqual('Custom error message.');
    });

    it('should handle expressions changes', () => {
      const { query, field, detectChanges } = renderComponent({
        key: 'title',
        options: { fieldChanges: new Subject<any>() },
        validators: {
          required: {
            expression: () => false,
            message: 'Custom error message.',
          },
        },
      });

      // without emit expressionChanges
      field.validation!.messages!['required'] = 'edited required message';
      detectChanges();

      expect(validationMessageContent(query)).not.toMatch(/edited required message/);

      // emit expressionChanges from a different field
      field.options?.fieldChanges?.next({
        type: 'expressionChanges',
        property: 'validation.messages.required',
        field: field.parent!,
        value: 'edit required message',
      });

      expect(validationMessageContent(query)).not.toMatch(/edited required message/);

      // emit expressionChanges from component field
      field.options?.fieldChanges?.next({
        type: 'expressionChanges',
        property: 'validation.messages.required',
        field: field,
        value: 'edit required message',
      });

      expect(validationMessageContent(query)).not.toMatch(/edited required message/);
    });
  });
});
