import { z } from 'zod'

export const SessionSchema = z.object({
  login: z.string(),
  password: z.string(),
})

export const RecoveryPasswordSchema = z.object({
  login: z.string(),
})

export const PasswordUpdateSchema = z.object({ password: z.string() })
