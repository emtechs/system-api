import { z } from 'zod';

export const StudentCreateSchema = z.object({
  name: z.string(),
  registry: z.string(),
});

export const StudentCreateWithClassSchema = z.object({
  name: z.string(),
  registry: z.string(),
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
});

export const StudentUpdateSchema = z
  .object({
    name: z.string().optional(),
  })
  .partial();

export const StudentUpdateInfrequency = z.object({
  students: z
    .object({
      student_id: z.string().uuid(),
    })
    .array(),
  periods: z
    .object({
      period_id: z.string().uuid(),
    })
    .array(),
});

const ClassAndSchoolSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

const YearSchema = z.object({
  id: z.string().uuid(),
  year: z.string(),
});

const ClassSchoolSchema = z.object({
  infrequency: z.number(),
  class: ClassAndSchoolSchema,
  school: ClassAndSchoolSchema,
  year: YearSchema,
});

export const StudentReturnSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  registry: z.string(),
  created_at: z.date(),
  classes: z.object({ class: ClassSchoolSchema }).array().optional(),
});

export const StudentArraySchema = StudentReturnSchema.array();
