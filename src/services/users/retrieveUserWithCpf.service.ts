import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserWithCpfService = async (login: string) => {
  const user = await prisma.user.findUnique({
    where: { login },
  });

  return UserReturnSchema.parse(user);
};
