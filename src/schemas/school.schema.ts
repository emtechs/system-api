import { z } from 'zod'

export const SchoolCreateSchema = z.object({
  name: z.string(),
})

export const SchoolReportSchema = z.object({
  model: z.enum(['resume', 'details']),
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
  period_id: z.string().uuid().optional(),
  initial: z.string().optional(),
  final: z.string().optional(),
})

export const SchoolServerCreateSchema = z.object({
  schools: z.object({ id: z.string().uuid() }).array(),
})

export const SchoolClassCreateSchema = z.object({
  classes: z.object({ id: z.string().uuid() }).array(),
})

export const SchoolUpdateSchema = SchoolCreateSchema.extend({
  is_active: z.boolean(),
  login: z.string(),
  cpf: z.string(),
  name_diret: z.string(),
  password: z.string(),
  role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']),
}).partial()

export const SchoolUpdateInfrequency = z.object({
  school_id: z.string().uuid(),
  periods: z
    .object({
      period_id: z.string().uuid(),
    })
    .array(),
})

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
})

export const ClassSchema = z.object({
  class: UserSchema.omit({ cpf: true }),
  infrequency: z.number(),
  _count: z.object({ students: z.number() }).optional(),
})

export const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  registry: z.string(),
  presented: z.number(),
  justified: z.number(),
  missed: z.number(),
  total_frequencies: z.number(),
  infrequency: z.number(),
  class: UserSchema.omit({ cpf: true }).optional(),
})

export const ServerSchema = z.object({
  role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']),
  server: UserSchema.optional(),
  school: UserSchema.omit({ cpf: true }).optional(),
})

export const ServerArraySchema = ServerSchema.array()

const DirectorSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  cpf: z.string(),
})

export const SchoolReturnSchema = z
  .object({
    id: z.string().uuid(),
    label: z.string().optional(),
    name: z.string(),
    is_active: z.boolean().optional(),
    director: DirectorSchema.nullable().optional(),
    classes: z.number().optional(),
    students: z.number().optional(),
    frequencies: z.number().optional(),
    servers: z.number().optional(),
    infrequency: z.number().optional(),
    server: DirectorSchema.extend({
      role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']),
      dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']),
    }).optional(),
  })
  .refine((fields) => (fields.label = fields.name))

export const SchoolArraySchema = SchoolReturnSchema.array()

export const SchoolServerReturnSchema = z.object({
  role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']).optional(),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']).optional(),
  school: SchoolReturnSchema,
})

export const SchoolServerArraySchema = SchoolServerReturnSchema.array()

export const SchoolListReturnSchema = z.object({
  id: z.string(),
  name: z.string(),
  is_active: z.boolean(),
  created_at: z.date(),
  infrequency: z.number(),
  director: UserSchema.nullable().optional(),
  servers: ServerSchema.array().optional(),
  num_students: z.number(),
  num_frequencies: z.number(),
  num_classes: z.number(),
})

export const SchoolListArraySchema = SchoolListReturnSchema.array()
