import prisma from '../../prisma';
import { IServerRequest } from '../../interfaces';
import { UserReturnSchema } from '../../schemas';
import { hashSync } from 'bcryptjs';

export const createServerService = async (
  { login, name, cpf, dash, password }: IServerRequest,
  school_id: string,
) => {
  const user = await prisma.user.findUnique({ where: { login } });

  if (user) {
    const server = await prisma.user.update({
      where: { id: user.id },
      data: { work_school: { create: { school_id, dash } } },
    });
    return UserReturnSchema.parse(server);
  }

  password = hashSync(password, 10);

  const server = await prisma.user.create({
    data: {
      login,
      name,
      cpf,
      dash,
      password,
      work_school: { create: { school_id, dash } },
    },
  });

  return UserReturnSchema.parse(server);
};
