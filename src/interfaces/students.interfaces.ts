import { z } from 'zod';
import {
  StudentCreateSchema,
  StudentCreateWithClassSchema,
  StudentUpdateSchema,
} from '../schemas';
import { IQuery } from './global.interfaces';

export interface IStudent {
  registry: string;
  name: string;
  school_id: string;
  class_id: string;
  year_id: string;
}

export type IStudentRequest = z.infer<typeof StudentCreateSchema>;

export type IStudentUpdateRequest = z.infer<typeof StudentUpdateSchema>;

export interface IStudentUpdate {
  infreq: number;
  id: string;
}

export interface IStudentUpdateMany {
  students: IStudentUpdate[];
}

export type IStudentWithClassRequest = z.infer<
  typeof StudentCreateWithClassSchema
>;

export interface IStudentQuery extends IQuery {
  year_id?: string;
  school_id?: string;
  is_active?: 'true' | 'false';
}
