import { z } from 'zod'

export const RequestCreateSchema = z.object({
  justification: z.string(),
  frequency_id: z.string().uuid().optional(),
  student_id: z.string().uuid().optional(),
})

export const RequestUpdateSchema = z.object({
  status: z.enum(['ACCEPTED', 'REFUSED']),
  requests: z.string().uuid().array(),
})

export const FrequencyCreateSchema = z.object({
  date: z.string(),
  name: z.string(),
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
  students: z.object({ student_id: z.string().uuid() }).array(),
})

export const FrequencyUpdateSchema = z
  .object({
    is_open: z.boolean(),
    finished_at: z.number(),
  })
  .partial()

const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  cpf: z.string(),
})

const ClassSchema = z.object({
  year: z.object({ id: z.string(), year: z.string() }).optional(),
  school: z.object({ id: z.string(), name: z.string() }).optional(),
  class: z.object({ id: z.string(), name: z.string() }).optional(),
  infrequency: z.number(),
})

const StudentSchema = z.object({
  id: z.string(),
  name: z.string(),
  registry: z.string(),
})

const StudentFrequencySchema = z.object({
  id: z.string(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
  justification: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  student: StudentSchema,
})

export const FrequencyReturnSchema = z.object({
  id: z.string(),
  date: z.string(),
  is_open: z.boolean(),
  created_at: z.date(),
  finished_at: z.number(),
  infrequency: z.number(),
  user: UserSchema.optional(),
  class: ClassSchema.optional(),
  students: StudentFrequencySchema.array().optional(),
  _count: z.object({ students: z.number() }).optional(),
})

export const FrequencyArraySchema = FrequencyReturnSchema.array()

const StudentInfreqSchema = z.object({
  id: z.string(),
  name: z.string(),
  registry: z.string(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
  justification: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
  frequencyStudent_id: z.string(),
  presences: z.number(),
  justified: z.number(),
  absences: z.number(),
  frequencies: z.number(),
  infrequency: z.number(),
})

export const FrequencyInfreqReturnSchema = FrequencyReturnSchema.extend({
  students: StudentInfreqSchema.array(),
  infreq: z.number(),
  class_infreq: z.number().optional(),
  school_frequencies: z.number().optional(),
  school_infreq: z.number().optional(),
})

export const FrequencyInfreqArraySchema = FrequencyInfreqReturnSchema.array()

export const FrequencyStudentCreateSchema = z.object({
  student_id: z.string().uuid(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']).optional(),
  justification: z.string().optional(),
  frequency_id: z.string().uuid(),
})

export const FrequencyStudentReturnSchema = z.object({
  id: z.string(),
  status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
  justification: z.string().nullable(),
  updated_at: z.string().nullable(),
  student: StudentSchema,
})

export const FrequencyStudentArraySchema = FrequencyStudentReturnSchema.array()

export const FrequencyStudentUpdateSchema = z
  .object({
    status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']).optional(),
    justification: z.string().optional(),
    updated_at: z.string(),
  })
  .partial()
