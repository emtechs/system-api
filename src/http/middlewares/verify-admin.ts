import { FastifyRequest, FastifyReply } from 'fastify'

export const verifyAdmin = (request: FastifyRequest, reply: FastifyReply) => {
  const { role } = request.user

  if (role !== 'ADMIN')
    return reply.status(401).send({ message: 'Unauthorized.' })
}
