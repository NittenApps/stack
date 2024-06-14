export type Demo = {
  id?: string;
  code?: string;
  name?: string;
  date?: string | Date;
  status?: { id?: string; code: string; name: string };
};
