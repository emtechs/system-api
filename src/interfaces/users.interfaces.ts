import { z } from 'zod';
import { UserCreateSchema, UserUpdateRequestSchema } from '../schemas';

export type IUserRequest = z.infer<typeof UserCreateSchema>;

export type IUserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;
