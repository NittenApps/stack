import { CatalogValue } from './catalog-value';

export type PropertyValue = {
  valueCode?: string;
  valueString?: string;
  valueNumber?: number;
  valueDate?: Date;
  valueBoolean?: boolean;
  valueText?: string;
  valueCatalog?: CatalogValue;
};
