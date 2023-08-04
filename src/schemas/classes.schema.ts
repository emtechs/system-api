import { z } from 'zod'

export const ClassCreateSchema = z.object({
  name: z.string(),
})

export const ClassReportSchema = z.object({
  key_class: z.string().uuid(),
  period_id: z.string().uuid().optional(),
  initial: z.string().optional(),
  final: z.string().optional(),
})

export const ClassSchoolCreateSchema = z.object({
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
})

export const ClassStudentCreateSchema = z.object({
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
  student_id: z.string().uuid(),
  class_id: z.string().uuid(),
})

export const ClassStudentUpdateSchema = z.object({
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
  student_id: z.string().uuid(),
  justify_disabled: z.string().optional(),
  finished_at: z.number().optional(),
})

export const ClassSchoolUpdateSchema = z.object({
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
  class_infreq: z.number(),
  school_frequencies: z.number(),
  school_infreq: z.number(),
})

export const ClassUpdateInfrequency = z.object({
  class_id: z.string().uuid(),
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
  periods: z
    .object({
      period_id: z.string().uuid(),
    })
    .array(),
})

export const ClassReturnSchema = z
  .object({
    id: z.string().uuid(),
    label: z.string().optional(),
    name: z.string(),
    schools: z.number().optional(),
    students: z.number().optional(),
    frequencies: z.number().optional(),
  })
  .refine((fields) => (fields.label = fields.name))

export const ClassArraySchema = ClassReturnSchema.array()

export const ClassSchoolReturnSchema = z.object({
  class: z.object({ id: z.string(), name: z.string() }),
  infrequency: z.number(),
  school: z.object({ id: z.string(), name: z.string() }).optional(),
  year: z.object({ id: z.string(), year: z.string() }).optional(),
  students: z
    .object({
      student: z.object({
        id: z.string(),
        name: z.string(),
        registry: z.string(),
      }),
    })
    .array()
    .optional(),
  _count: z.object({ frequencies: z.number(), students: z.number() }),
})

export const ClassSchoolArraySchema = ClassSchoolReturnSchema.array()

export const ClassSchoolFrequencyReturnSchema = z.object({
  class: z.object({ id: z.string(), name: z.string() }),
  infrequency: z.number(),
  school: z.object({ id: z.string(), name: z.string() }),
  year: z.object({ id: z.string(), year: z.string() }),
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
  _count: z.object({ frequencies: z.number(), students: z.number() }),
  infreq: z.number(),
})

export const ClassSchoolFrequencyArraySchema =
  ClassSchoolFrequencyReturnSchema.array()

const ClassSchema = z.object({
  class: z.object({ id: z.string(), name: z.string() }),
  school: z.object({ id: z.string(), name: z.string() }),
})

export const ClassStudentReturnSchema = z.object({
  class: ClassSchema,
  student: z.object({
    id: z.string(),
    name: z.string(),
    registry: z.string(),
  }),
})

export const ClassStudentArraySchema = ClassStudentReturnSchema.array()

export const DeleteClassStudentSchema = z.object({
  justify_disabled: z.string(),
  finished_at: z.number(),
})

export const TransferClassStudentSchema = z.object({
  justify_disabled: z.string(),
  finished_at: z.number(),
  school_id: z.string().uuid(),
  year_id: z.string().uuid(),
  student_id: z.string().uuid(),
  key: z.string().uuid(),
  class_id: z.string().uuid(),
})
