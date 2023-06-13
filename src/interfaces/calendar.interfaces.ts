import { z } from 'zod';
import { YearCreateSchema } from '../schemas';
import { IQuery } from './global.interfaces';

export type IYearRequest = z.infer<typeof YearCreateSchema>;

export interface ICalendarQuery extends IQuery {
  start_date?: string;
  end_date?: string;
  school_id?: string;
  date?: string;
}
