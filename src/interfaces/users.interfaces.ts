import { z } from 'zod';
import { UserCreateSchema, UserUpdateRequestSchema } from '../schemas';

export type IRole = 'ADMIN' | 'SERV' | 'DIRET' | 'SECRET';

export type IDash = 'COMMON' | 'SCHOOL' | 'ORGAN' | 'ADMIN';

export type IUserRequest = z.infer<typeof UserCreateSchema>;

export type IUserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;

export interface IUserQuery {
  role?: IRole;
  is_active?: boolean;
  isNot_director_school?: boolean;
}

export interface IUserCreateQuery {
  school_id?: string;
}

export interface IUserCpfQuery {
  school_id?: string;
  isSecret?: boolean;
}
