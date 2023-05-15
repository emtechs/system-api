import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveServerWithCpfService = async (
  school_id: string,
  login: string,
) => {
  const server = await prisma.schoolServer.findFirst({
    where: { AND: { server: { login }, school_id } },
  });

  return server;
};
