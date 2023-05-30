import { z } from 'zod';
import {
  FrequencyStudentCreateSchema,
  FrequencyStudentUpdateSchema,
  FrequencyUpdateSchema,
  SchoolCreateSchema,
  SchoolUpdateSchema,
  SchoolYearCreateSchema,
} from '../schemas';
import { IQuery } from './global.interfaces';

export type ISchoolRequest = z.infer<typeof SchoolCreateSchema>;

export type ISchoolUpdateRequest = z.infer<typeof SchoolUpdateSchema>;

export type ISchoolYearRequest = z.infer<typeof SchoolYearCreateSchema>;

export interface ISchool {
  name: string;
}

export type IStatusFrequency = 'OPENED' | 'CLOSED';

export interface IFrequencyRequest {
  date: string;
  month: number;
  class_id: string;
  school_id: string;
  school_year_id: string;
  students: {
    student_id: string;
  }[];
}

export type IFrequencyUpdateRequest = z.infer<typeof FrequencyUpdateSchema>;

export type IStatusStudent = 'PRESENTED' | 'MISSED' | 'JUSTIFIED';

export type IFrequencyStudentRequest = z.infer<
  typeof FrequencyStudentCreateSchema
>;

export type IFrequencyStudentUpdateRequest = z.infer<
  typeof FrequencyStudentUpdateSchema
>;

export interface ISchoolQuery extends IQuery {
  is_active?: 'true' | 'false';
  is_dash?: string;
  school_year_id?: string;
}

export interface IFrequencyQuery extends IQuery {
  status?: IStatusFrequency;
  date?: string;
  class_id?: string;
  school_year_id?: string;
  is_infreq?: boolean;
}
