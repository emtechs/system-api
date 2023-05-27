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
