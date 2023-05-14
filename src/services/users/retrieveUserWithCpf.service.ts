import prisma from '../../prisma';
import { UserReturnSchema } from '../../schemas';

export const retrieveUserWithCpfService = async (cpf: string) => {
  const user = await prisma.user.findUnique({
    where: { cpf },
  });

  return UserReturnSchema.parse(user);
};
