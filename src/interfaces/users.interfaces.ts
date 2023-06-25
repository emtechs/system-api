import { z } from 'zod';
import { UserCreateSchema, UserUpdateRequestSchema } from '../schemas';
import { IQuery } from './global.interfaces';

export type IRole = 'ADMIN' | 'SERV' | 'DIRET' | 'SECRET';

export type IDash = 'COMMON' | 'SCHOOL' | 'ORGAN' | 'ADMIN';

export interface IRequestUser {
  id: string;
  role: IRole;
}

export interface IUser {
  login: string;
  name: string;
  cpf: string;
}

export type IUserRequest = z.infer<typeof UserCreateSchema>;

export type IUserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>;

export interface IUserQuery extends IQuery {
  role?: IRole;
  is_active?: 'true' | 'false';
  isNot_director_school?: 'true' | 'false';
  school_id?: string;
  allNotServ?: 'true' | 'false';
  director?: 'true' | 'false';
  name?: string;
}
