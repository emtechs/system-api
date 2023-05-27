import { z } from 'zod';
import { ClassCreateSchema, ClassStudentCreateSchema } from '../schemas';

export interface IClass {
  name: string;
}

export type IClassRequest = z.infer<typeof ClassCreateSchema>;

export type IClassStudentRequest = z.infer<typeof ClassStudentCreateSchema>;

export interface IClassQuery {
  school_id?: string;
  school_year_id?: string;
  is_active?: 'true' | 'false';
}
