/**
 * @jest-environment jsdom
 */

import { createFieldComponent as renderComponent } from '@na-stack/forms/testing';

describe('Group Field Type', () => {
  it('should render fieldGroup', () => {
    const { query, queryAll } = renderComponent({
      type: 'nas-form-group',
      fieldGroup: [{ key: 'title1' }, { key: 'title2' }],
    });

    expect(query('nas-form-group')).not.toBeNull();
    expect(queryAll('nas-form-group > nas-field')).toHaveLength(2);
  });

  it('should add fieldGroupClassName', () => {
    const { field, query, detectChanges } = renderComponent({
      fieldGroupClassName: 'foo-class',
      type: 'nas-form-group',
    });

    expect(query('nas-form-group').properties['className']).toEqual('foo-class');

    field.fieldGroupClassName = 'bar-class';
    detectChanges();

    expect(query('nas-form-group').properties['className']).toEqual('bar-class');
  });
});
