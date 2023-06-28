import { z } from 'zod';
import {
  ClassCreateSchema,
  ClassSchoolCreateSchema,
  ClassStudentCreateSchema,
  ClassStudentUpdateSchema,
} from '../schemas';
import { IQuery } from './global.interfaces';

export interface IClass {
  name: string;
}

export type IClassRequest = z.infer<typeof ClassCreateSchema>;

export interface IClassSchoolUpdateRequest {
  class_id: string;
  school_id: string;
  year_id: string;
  school_frequencies: number;
  school_infreq: number;
  class_infreq: number;
}

export interface IClassUpdateInfrequency {
  class_id: string;
  school_id: string;
  year_id: string;
  periods: { period_id: string }[];
}

export type IClassSchoolRequest = z.infer<typeof ClassSchoolCreateSchema>;

export type IClassStudentRequest = z.infer<typeof ClassStudentCreateSchema>;

export type IClassStudentUpdate = z.infer<typeof ClassStudentUpdateSchema>;

export interface IClassQuery extends IQuery {
  class_id?: string;
  school_id?: string;
  year_id?: string;
  is_active?: 'true' | 'false';
  infreq?: number;
  date?: string;
  is_infreq?: string;
  name?: string;
}
