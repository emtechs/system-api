import 'dotenv/config'
import { z } from 'zod'
import { AppError } from '../errors'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('production'),
  PORT: z.coerce.number().default(3333),
  SECRET_KEY: z.string(),
  BASE_URL: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('❌ Invalid enviroment variables', _env.error.format())

  throw new AppError('Invalid enviroment variables.')
}

export const env = _env.data
