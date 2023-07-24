import { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '../../lib'
import { z } from 'zod'

export const verifySchoolServer = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const paramsSchema = z.object({
    school_id: z.string().uuid(),
  })

  const { school_id } = paramsSchema.parse(request.params)
  const { id: server_id, role } = request.user

  const server = await prisma.schoolServer.findUnique({
    where: {
      school_id_server_id: {
        school_id,
        server_id,
      },
    },
  })

  if (!server || role !== 'ADMIN')
    return reply.status(401).send({ message: 'Unauthorized.' })
}
