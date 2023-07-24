import fastify from 'fastify'
import { handleError } from './http/error'

export const app = fastify()

app.setErrorHandler(handleError)
