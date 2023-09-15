import { z } from 'zod'
import {
  UserCreateSchema,
  UserReturnSchema,
  UserUpdateRequestSchema,
} from '../schemas'
import { IQuery } from './global.interfaces'

export type IRole = 'ADMIN' | 'SERV' | 'DIRET' | 'SECRET'

export type IDash = 'COMMON' | 'SCHOOL' | 'ORGAN' | 'ADMIN'

export interface IRequestUser {
  id: string
  role: IRole
}

export interface IUser {
  login: string
  name: string
  cpf: string
}

export type IUserReturn = z.infer<typeof UserReturnSchema>

export type IUserRequest = z.infer<typeof UserCreateSchema>

export type IUserUpdateRequest = z.infer<typeof UserUpdateRequestSchema>

export interface IUserQuery extends IQuery {
  role?: IRole
  isNot_director_school?: 'true' | 'false'
  allNotServ?: 'true' | 'false'
  director?: 'true' | 'false'
  name?: string
  is_server?: 'true' | 'false'
}
