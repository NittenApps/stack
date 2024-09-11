/**
 * @jest-environment jsdom
 */

import { createFieldComponent as renderComponent } from '@na-stack/forms/testing';

describe('Template Field Type', () => {
  it('should render template', () => {
    const { field, query, detectChanges } = renderComponent({
      template: '<div>foo</div>',
    });

    expect(query('nas-template')).not.toBeNull();
    expect(query('nas-template').nativeElement.textContent).toEqual('foo');

    field.template = '<div>bar</div>';
    detectChanges();

    expect(query('nas-template').nativeElement.textContent).toEqual('bar');
  });
});
