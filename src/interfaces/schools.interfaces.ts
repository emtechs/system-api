import { z } from 'zod';
import {
  ClassCreateSchema,
  FrequencyCreateSchema,
  FrequencyStudentCreateSchema,
  SchoolCreateSchema,
  ServerCreateSchema,
  StudentCreateSchema,
} from '../schemas';

export type ISchoolRequest = z.infer<typeof SchoolCreateSchema>;

export type IServerRequest = z.infer<typeof ServerCreateSchema>;

export type IClassRequest = z.infer<typeof ClassCreateSchema>;

export type IStudentRequest = z.infer<typeof StudentCreateSchema>;

export type IFrequencyRequest = z.infer<typeof FrequencyCreateSchema>;

export type IFrequencyStudentRequest = z.infer<
  typeof FrequencyStudentCreateSchema
>;
