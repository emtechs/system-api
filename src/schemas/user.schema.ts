import { z } from 'zod';
import { SchoolReturnSchema } from './school.schema';

export const UserCreateSchema = z.object({
  login: z.string(),
  name: z.string(),
  password: z.string(),
  cpf: z.string(),
  role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']).optional(),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']).default('COMMON'),
});

export const UserReturnSchema = UserCreateSchema.extend({
  id: z.string(),
  email: z.string().email().nullable(),
  created_at: z.date(),
  is_active: z.boolean(),
  is_first_access: z.boolean(),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']),
  director_school: SchoolReturnSchema.nullable().optional(),
  work_school: z
    .object({
      id: z.string(),
      dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']),
      school: z.object({
        id: z.string(),
        name: z.string(),
        frequencies: z
          .object({
            id: z.string(),
            date: z.string(),
            status: z.enum(['OPENED', 'CLOSED']),
            class: z.object({
              id: z.string(),
              name: z.string(),
            }),
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
      }),
    })
    .array()
    .optional(),
}).omit({ password: true });

export const UserUpdateRequestSchema = UserCreateSchema.extend({
  email: z.string().email(),
  old_password: z.string(),
  is_active: z.boolean().optional(),
  is_first_access: z.boolean().optional(),
  dash: z.enum(['COMMON', 'SCHOOL', 'ORGAN', 'ADMIN']).optional(),
})
  .omit({ login: true, cpf: true })
  .partial();

export const UserArraySchema = UserReturnSchema.array();
