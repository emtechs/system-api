import { z } from 'zod'
import {
  SessionSchema,
  RecoveryPasswordSchema,
  PasswordUpdateSchema,
} from '../schemas'
import { IQuery } from './global.interfaces'

export type ISessionRequest = z.infer<typeof SessionSchema>

export type IRecoveryPasswordRequest = z.infer<typeof RecoveryPasswordSchema>

export type IPasswordUpdateRequest = z.infer<typeof PasswordUpdateSchema>

export interface IAuthQuery extends IQuery {
  year?: string
}
