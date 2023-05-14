import { z } from 'zod';

export const UserCreateSchema = z.object({
  login: z.string(),
  password: z.string(),
  cpf: z.string(),
  role: z.enum(['SERV', 'DIRET', 'SECRET', 'ADMIN']).optional(),
  is_first_access: z.boolean().optional(),
});

export const UserReturnSchema = UserCreateSchema.extend({
  id: z.string(),
  name: z.string().nullable(),
  email: z.string().email().nullable(),
  phone: z.string().nullable(),
  created_at: z.date(),
  is_active: z.boolean(),
}).omit({ password: true });

export const UserUpdateRequestSchema = UserCreateSchema.extend({
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  old_password: z.string(),
  is_active: z.boolean().optional(),
})
  .omit({ cpf: true })
  .partial();

export const UserArraySchema = UserReturnSchema.array();
