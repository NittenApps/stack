import { AttributeValue } from './attribute-value';

export type CatalogValue = {
  id?: string;
  catalogCode?: string;
  code?: string;
  name?: string;
  description?: string;
  attributes?: { [key: string]: AttributeValue[] };
};
