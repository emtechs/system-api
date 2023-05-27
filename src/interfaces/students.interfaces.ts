import { z } from 'zod';
import { StudentCreateSchema, StudentCreateWithClassSchema } from '../schemas';

export interface IStudent {
  registry: string;
  name: string;
  school_id: string;
  class_id: string;
  school_year_id: string;
}

export type IStudentRequest = z.infer<typeof StudentCreateSchema>;

export type IStudentWithClassRequest = z.infer<
  typeof StudentCreateWithClassSchema
>;

export interface IStudentQuery {
  school_year_id?: string;
}
