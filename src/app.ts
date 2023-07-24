import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import { AppError } from './http/error'

export const app = fastify()

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError)
    return reply.status(error.statusCode).send({
      message: error.message,
    })

  if (error instanceof ZodError)
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })

  if (env.NODE_ENV !== 'production') console.error(error)

  return reply.status(500).send({ message: 'Internal server error.' })
})
