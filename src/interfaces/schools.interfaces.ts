import { z } from 'zod';
import {
  ClassCreateSchema,
  FrequencyStudentCreateSchema,
  FrequencyStudentUpdateSchema,
  FrequencyUpdateSchema,
  SchoolCreateSchema,
  ServerCreateSchema,
  StudentCreateSchema,
} from '../schemas';

export type ISchoolRequest = z.infer<typeof SchoolCreateSchema>;

export type IServerRequest = z.infer<typeof ServerCreateSchema>;

export type IClassRequest = z.infer<typeof ClassCreateSchema>;

export type IStudentRequest = z.infer<typeof StudentCreateSchema>;

export type IStatusFrequency = 'OPENED' | 'CLOSED';

export interface IFrequencyRequest {
  date: string;
  class_id: string;
  students: {
    student_id: string;
  };
}

export type IFrequencyUpdateRequest = z.infer<typeof FrequencyUpdateSchema>;

export type IStatusStudent = 'PRESENTED' | 'MISSED' | 'JUSTIFIED';

export type IFrequencyStudentRequest = z.infer<
  typeof FrequencyStudentCreateSchema
>;

export type IFrequencyStudentUpdateRequest = z.infer<
  typeof FrequencyStudentUpdateSchema
>;

export interface IFrequencyQuery {
  status?: IStatusFrequency;
  school_id?: string;
  date?: string;
  class_id?: string;
}

export interface IClassQuery {
  school_id?: string;
}
