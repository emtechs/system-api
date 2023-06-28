import { z } from 'zod';
import { SchoolCreateSchema, SchoolUpdateSchema } from '../schemas';
import { IQuery } from './global.interfaces';

export type ISchoolRequest = z.infer<typeof SchoolCreateSchema>;

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
  is_active?: 'true' | 'false';
  year_id?: string;
  is_listSchool?: string;
  is_director?: string;
  infreq?: number;
  name?: string;
  date?: string;
}
