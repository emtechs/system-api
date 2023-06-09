import { z } from 'zod';

export const SchoolCreateSchema = z.object({
  name: z.string(),
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

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
});

const ClassSchema = z.object({
  class: UserSchema.omit({ cpf: true }),
  class_infreq: z.number(),
  _count: z.object({ students: z.number() }).optional(),
});

const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  registry: z.string(),
  presented: z.number(),
  justified: z.number(),
  missed: z.number(),
  total_frequencies: z.number(),
  infrequency: z.number(),
  class: UserSchema.omit({ cpf: true }).optional(),
});

const ServerSchema = z.object({
  role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']),
  server: UserSchema,
});

export const SchoolReturnSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  created_at: z.date(),
  school_infreq: z.number(),
  director: UserSchema.nullable().optional(),
  servers: ServerSchema.array().optional(),
  classes: ClassSchema.array().optional(),
  students: StudentSchema.array().optional(),
  infrequency: z.number().optional(),
  total_students: z.number().optional(),
  _count: z.object({ classes: z.number() }).optional(),
});

export const SchoolArraySchema = SchoolReturnSchema.array();

export const SchoolListReturnSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  created_at: z.date(),
  school_infreq: z.number(),
  director: UserSchema.nullable().optional(),
  servers: ServerSchema.array().optional(),
  num_students: z.number(),
  num_frequencies: z.number(),
  num_classes: z.number(),
});

export const SchoolListArraySchema = SchoolListReturnSchema.array();
