import { z } from 'zod';

export const FrequencyCreateSchema = z.object({
  date: z.string(),
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
  school_year_id: z.string().uuid(),
  students: z.object({ student_id: z.string().uuid() }).array(),
});

export const FrequencyUpdateSchema = z
  .object({
    status: z.enum(['OPENED', 'CLOSED']).optional(),
    finished_at: z.number(),
  })
  .partial();

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
});

const ClassSchema = z.object({
  school_year: z.object({ id: z.string(), year: z.string() }),
  school: z.object({ id: z.string(), name: z.string() }),
  class: z.object({ id: z.string(), name: z.string() }),
});

const StudentSchema = z.object({
  id: z.string(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
  justification: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  student: z.object({ id: z.string(), name: z.string(), registry: z.string() }),
});

export const FrequencyReturnSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.string(),
  created_at: z.date(),
  finished_at: z.number(),
  user: UserSchema,
  class: ClassSchema,
  students: StudentSchema.array(),
  _count: z.object({ students: z.number() }),
});

export const FrequencyArraySchema = FrequencyReturnSchema.array();

const StudentInfreqSchema = z.object({
  id: z.string(),
  name: z.string(),
  registry: z.string(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
  justification: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  infrequency: z.number(),
  frequencyStudent_id: z.string(),
});

export const FrequencyInfreqReturnSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.string(),
  created_at: z.date(),
  finished_at: z.number(),
  user: UserSchema,
  class: ClassSchema,
  students: StudentInfreqSchema.array(),
  _count: z.object({ students: z.number() }),
  infrequency: z.number(),
  class_infreq: z.number().optional(),
  school_infreq: z.number().optional(),
});

export const FrequencyInfreqArraySchema = FrequencyInfreqReturnSchema.array();

export const FrequencyStudentCreateSchema = z.object({
  student_id: z.string().uuid(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']).optional(),
  justification: z.string().optional(),
  frequency_id: z.string().uuid(),
});

export const FrequencyStudentUpdateSchema = z
  .object({
    status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']).optional(),
    justification: z.string().optional(),
    updated_at: z.string(),
  })
  .partial();
