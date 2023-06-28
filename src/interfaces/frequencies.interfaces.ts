import { z } from 'zod';
import {
  FrequencyStudentCreateSchema,
  FrequencyStudentUpdateSchema,
  FrequencyUpdateSchema,
} from '../schemas';
import { IQuery } from './global.interfaces';

export type IStatusFrequency = 'OPENED' | 'CLOSED';

export interface IFrequencyRequest {
  date: string;
  name: string;
  class_id: string;
  school_id: string;
  year_id: string;
  students: {
    student_id: string;
  }[];
}

export interface IFrequencyHistoryCreate {
  id: string;
  status: IStatusStudent;
  justification?: string;
}

export type IFrequencyUpdateRequest = z.infer<typeof FrequencyUpdateSchema>;

export type IStatusStudent = 'PRESENTED' | 'MISSED' | 'JUSTIFIED';

export type IFrequencyStudentRequest = z.infer<
  typeof FrequencyStudentCreateSchema
>;

export type IFrequencyStudentUpdateRequest = z.infer<
  typeof FrequencyStudentUpdateSchema
>;

export interface IFrequencyQuery extends IQuery {
  status?: IStatusFrequency;
  date?: string;
  class_id?: string;
  year_id?: string;
  is_infreq?: string;
  is_dash?: string;
  school_id?: string;
}

export interface IFrequencyStudentQuery extends IQuery {
  is_alter?: string;
  isNot_presented?: string;
}
