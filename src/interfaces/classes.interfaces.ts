import { z } from 'zod';
import { ClassCreateSchema, ClassStudentCreateSchema } from '../schemas';
import { IQuery } from './global.interfaces';

export interface IClass {
  name: string;
}

export type IClassRequest = z.infer<typeof ClassCreateSchema>;

export interface IClassSchoolUpdateRequest {
  class_id: string;
  school_id: string;
  school_year_id: string;
  school_infreq: number;
  class_infreq: number;
}

export type IClassStudentRequest = z.infer<typeof ClassStudentCreateSchema>;

export interface IClassQuery extends IQuery {
  school_id?: string;
  school_year_id?: string;
  is_active?: 'true' | 'false';
  class_infreq?: number;
}