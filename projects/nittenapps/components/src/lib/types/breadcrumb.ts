export type Breadcrumb = {
  disabled: boolean;
  label: string;
  url: string;
}

export type BreadcrumbConfig = {
  disabled: boolean | undefined;
  label: string | number | ((data: any) => string | number);
}
