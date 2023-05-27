import { z } from 'zod';

export const SchoolCreateSchema = z.object({
  name: z.string(),
});

export const SchoolYearCreateSchema = z.object({
  year: z.string(),
});

export const SchoolUpdateSchema = SchoolCreateSchema.extend({
  is_active: z.boolean(),
  login: z.string(),
  cpf: z.string(),
  name_diret: z.string(),
  password: z.string(),
  role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']),
}).partial();

export const SchoolReturnSchema = z.object({
  id: z.string(),
  name: z.string(),
  created_at: z.date(),
  is_active: z.boolean(),
});

const ServerSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
});

export const SchoolArraySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    created_at: z.date(),
    is_active: z.boolean(),
    director: z
      .object({ id: z.string(), name: z.string(), cpf: z.string() })
      .nullable(),
    servers: z
      .object({
        server: ServerSchema,
      })
      .array(),
  })
  .array();

export const SchoolFreqArraySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    director: z
      .object({ id: z.string(), name: z.string(), cpf: z.string() })
      .nullable(),
    students: z
      .object({
        id: z.string(),
        name: z.string(),
        registry: z.string(),
        presented: z.number(),
        justified: z.number(),
        missed: z.number(),
        total_frequencies: z.number(),
        infrequency: z.number(),
      })
      .array(),
    infrequency: z.number(),
    total_students: z.number(),
  })
  .array();
