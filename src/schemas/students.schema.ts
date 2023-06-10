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

export const StudentUpdateManySchema = z.object({
  students: z.object({ id: z.string().uuid(), infreq: z.number() }).array(),
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
  class_infreq: z.number(),
  class: ClassAndSchoolSchema,
  school: ClassAndSchoolSchema,
  year: YearSchema,
});

export const StudentReturnSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  registry: z.string(),
  created_at: z.date(),
  infreq: z.number(),
  classes: z.object({ class: ClassSchoolSchema }).array().optional(),
});

export const StudentArraySchema = StudentReturnSchema.array();
