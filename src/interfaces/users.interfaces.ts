import { z } from 'zod';
import { UserCreateSchema, UserUpdateRequestSchema } from '../schemas';
import { IQuery } from './global.interfaces';

export type IRole = 'ADMIN' | 'SERV' | 'DIRET' | 'SECRET';

export type IDash = 'COMMON' | 'SCHOOL' | 'ORGAN' | 'ADMIN';

export type IUserRequest = z.infer<typeof UserCreateSchema>;

export type IUserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;

export interface IUserQuery extends IQuery {
  role?: IRole;
  is_active?: 'true' | 'false';
  isNot_director_school?: 'true' | 'false';
}

export interface IUserCreateQuery {
  school_id?: string;
  allNotServ?: 'true' | 'false';
}

export interface IUserCpfQuery {
  school_id?: string;
  allNotServ?: 'true' | 'false';
}
