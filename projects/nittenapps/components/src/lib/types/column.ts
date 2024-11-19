type stringFunc = (id: string, item?: any) => string;

export type Column = {
  id: string;
  type?: 'string' | 'decimal' | 'integer' | 'date' | 'datetime';
  field?: string;
  title: string;
  sortable?: boolean;
  value?: string | stringFunc;
};
