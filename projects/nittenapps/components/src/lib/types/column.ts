import { IconProp } from '@fortawesome/fontawesome-svg-core';

type iconFunc = (id: string, item?: any) => IconProp | undefined;
type stringFunc = (id: string, item?: any) => string;

export type Column = {
  id: string;
  type?: 'string' | 'decimal' | 'integer' | 'date' | 'datetime' | 'icon';
  field?: string;
  title: string;
  sortable?: boolean;
  value?: string | stringFunc;
  icon?: IconProp | iconFunc;
  class?: string;
};
