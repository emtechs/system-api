import { z } from 'zod';

export const MonthCreateSchema = z.object({
  month: z.number(),
  name: z.string(),
});

export const MonthArraySchema = MonthCreateSchema.array();

export const FrequencyCreateSchema = z.object({
  date: z.string(),
  month: z.number(),
  day: z.number(),
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
  school_year_id: z.string().uuid(),
  students: z.object({ student_id: z.string().uuid() }).array(),
});

export const FrequencyUpdateSchema = z
  .object({
    status: z.enum(['OPENED', 'CLOSED']).optional(),
    finished_at: z.number(),
    school_year_id: z.string().uuid(),
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
  class_infreq: z.number(),
});

const StudentSchema = z.object({
  id: z.string(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
  justification: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  student: z.object({
    id: z.string(),
    name: z.string(),
    registry: z.string(),
    infreq: z.number(),
  }),
});

const DaySchema = z.object({
  day: z.number(),
});

export const FrequencyReturnSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.string(),
  created_at: z.date(),
  finished_at: z.number(),
  month: MonthCreateSchema.optional(),
  day: DaySchema.optional(),
  user: UserSchema.optional(),
  class: ClassSchema.optional(),
  students: StudentSchema.array().optional(),
  _count: z.object({ students: z.number() }).optional(),
});

export const FrequencyArraySchema = FrequencyReturnSchema.array();

const StudentInfreqSchema = z.object({
  id: z.string(),
  name: z.string(),
  registry: z.string(),
  infreq: z.number(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
  justification: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  infrequency: z.number(),
  frequencyStudent_id: z.string(),
});

export const FrequencyInfreqReturnSchema = FrequencyReturnSchema.extend({
  students: StudentInfreqSchema.array(),
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
