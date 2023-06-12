import { z } from 'zod';
import { YearCreateSchema } from '../schemas';

export type IYearRequest = z.infer<typeof YearCreateSchema>;

export interface ICalendarQuery {
  start_date?: string;
  end_date?: string;
}
