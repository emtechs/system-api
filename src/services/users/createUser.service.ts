import prisma from '../../prisma';
import { IUserRequest } from '../../interfaces';
import { hashSync } from 'bcryptjs';
import { AppError } from '../../errors';
import { UserReturnSchema } from '../../schemas';

export const createUserService = async ({
  login,
  password,
  cpf,
  role,
  is_first_access,
}: IUserRequest) => {
  let user = await prisma.user.findUnique({
    where: { cpf },
  });

  if (user) {
    throw new AppError('user already exists', 409);
  }

  password = hashSync(password, 10);

  user = await prisma.user.create({
    data: {
      login,
      password,
      cpf,
      role,
      is_first_access,
    },
  });

  return UserReturnSchema.parse(user);
};
