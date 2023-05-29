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
  school_year_id: string;
}

export type IStudentRequest = z.infer<typeof StudentCreateSchema>;

export type IStudentUpdateRequest = z.infer<typeof StudentUpdateSchema>;

export type IStudentWithClassRequest = z.infer<
  typeof StudentCreateWithClassSchema
>;

export interface IStudentQuery extends IQuery {
  school_year_id?: string;
  school_id?: string;
}
