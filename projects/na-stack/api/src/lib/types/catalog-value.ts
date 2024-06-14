import { PropertyValue } from './property-value';

export type CatalogValue = {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  proerties?: { [key: string]: PropertyValue[] };
};
