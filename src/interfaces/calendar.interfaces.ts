import { z } from 'zod';
import { MonthCreateSchema, SchoolYearCreateSchema } from '../schemas';

export type ISchoolYearRequest = z.infer<typeof SchoolYearCreateSchema>;

export type IMonthRequest = z.infer<typeof MonthCreateSchema>;

export interface IMonth {
  month: number;
  name: string;
}
