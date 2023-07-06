import { z } from 'zod';
import {
  SchoolClassCreateSchema,
  SchoolCreateSchema,
  SchoolReturnSchema,
  SchoolServerCreateSchema,
  SchoolServerReturnSchema,
  SchoolUpdateSchema,
} from '../schemas';
import { IQuery } from './global.interfaces';

export type ISchoolRequest = z.infer<typeof SchoolCreateSchema>;

export type ISchoolData = z.infer<typeof SchoolReturnSchema>;

export type ISchoolServerData = z.infer<typeof SchoolServerReturnSchema>;

export type ISchoolServerRequest = z.infer<typeof SchoolServerCreateSchema>;

export type ISchoolClassRequest = z.infer<typeof SchoolClassCreateSchema>;

export type ISchoolUpdateRequest = z.infer<typeof SchoolUpdateSchema>;

export interface ISchool {
  name: string;
  director_id: string;
}

export interface ISchoolUpdate {
  id?: string;
}

export interface ISchoolUpdateInfrequency {
  school_id: string;
  periods: { period_id: string }[];
}

export interface ISchoolQuery extends IQuery {
  year_id?: string;
  is_director?: 'true' | 'false';
  infreq?: number;
  name?: string;
  date?: string;
  director_id?: string;
  server_id?: string;
}
