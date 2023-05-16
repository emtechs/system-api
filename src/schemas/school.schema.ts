import { z } from 'zod';

export const SchoolCreateSchema = z.object({
  name: z.string(),
  director_id: z.string().uuid(),
});

export const SchoolReturnSchema = SchoolCreateSchema.extend({
  id: z.string(),
  created_at: z.date(),
  is_active: z.boolean(),
}).omit({ director_id: true });

const ServerSchema = z.object({ id: z.string(), name: z.string().nullable() });

export const SchoolArraySchema = z
  .object({
    id: z.string(),
    name: z.string(),
    created_at: z.date(),
    is_active: z.boolean(),
    director: ServerSchema,
    servers: z
      .object({
        id: z.string(),
        server: ServerSchema,
      })
      .array()
      .optional(),
    frequencies: z
      .object({
        id: z.string(),
        date: z.string(),
        status: z.string(),
        class: z.object({ id: z.string(), name: z.string() }),
        students: z
          .object({
            id: z.string(),
            status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
            justification: z.string().optional().nullable(),
            updated_at: z.string().optional().nullable(),
            student: z.object({
              id: z.string(),
              name: z.string(),
              registry: z.string(),
            }),
          })
          .array(),
      })
      .array(),
  })
  .array();

export const ServerCreateSchema = z.object({
  login: z.string(),
  name: z.string(),
  password: z.string(),
  cpf: z.string(),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']).optional(),
});

export const ClassCreateSchema = z.object({
  name: z.string(),
});

export const ClassReturnSchema = ClassCreateSchema.extend({
  id: z.string(),
  is_active: z.boolean(),
  created_at: z.date(),
  school: z.object({
    id: z.string(),
    name: z.string(),
  }),
  students: z
    .object({ id: z.string(), name: z.string(), registry: z.string() })
    .array(),
});

export const ClassArraySchema = ClassReturnSchema.array();

export const StudentCreateSchema = z.object({
  name: z.string(),
  registry: z.string(),
  class_id: z.string().uuid(),
});

export const FrequencyCreateSchema = z.object({
  date: z.string(),
  class_id: z.string().uuid(),
  students: z.object({ student_id: z.string().uuid() }).array(),
});

export const FrequencyUpdateSchema = z
  .object({
    status: z.enum(['OPENED', 'CLOSED']).optional(),
  })
  .partial();

export const FrequencyReturnSchema = z.object({
  id: z.string(),
  date: z.string(),
  status: z.string(),
  created_at: z.date(),
  school: z.object({
    id: z.string(),
    name: z.string(),
  }),
  class: z.object({ id: z.string(), name: z.string() }),
  students: z
    .object({
      id: z.string(),
      status: z.enum(['PRESENTED', 'MISSED', 'JUSTIFIED']),
      justification: z.string().optional().nullable(),
      updated_at: z.string().optional().nullable(),
      student: z.object({
        id: z.string(),
        name: z.string(),
        registry: z.string(),
      }),
    })
    .array(),
});

export const FrequencyArraySchema = FrequencyReturnSchema.array();

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