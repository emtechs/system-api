import prisma from '../../prisma';
import { IUserCreateQuery, IUserRequest } from '../../interfaces';
import { hashSync } from 'bcryptjs';
import { AppError } from '../../errors';
import { UserReturnSchema } from '../../schemas';
import { updateSchool } from '../../scripts';

export const createUserService = async (
  { login, name, password, cpf, role, dash, schools }: IUserRequest,
  { allNotServ }: IUserCreateQuery,
) => {
  let user = await prisma.user.findUnique({
    where: { login },
  });

  if (schools) {
    if (!user) {
      password = hashSync(password, 10);
      user = await prisma.user.create({
        data: {
          login,
          name,
          password,
          cpf,
          role,
          dash,
        },
      });
    }

    await updateSchool(schools, user.id);

    return UserReturnSchema.parse(user);
  }

  switch (role) {
  case 'ADMIN':
    dash = 'ADMIN';
    break;
  case 'SECRET':
    dash = 'ORGAN';
    break;
  case 'DIRET':
    dash = 'SCHOOL';
    break;
  }

  if (allNotServ) {
    if (user) {
      const server = await prisma.user.update({
        where: { id: user.id },
        data: { role, dash, is_active: true },
      });
      return UserReturnSchema.parse(server);
    }

    password = hashSync(password, 10);

    const server = await prisma.user.create({
      data: {
        login,
        name,
        cpf,
        role,
        dash,
        password,
      },
    });

    return UserReturnSchema.parse(server);
  }

  if (user) {
    throw new AppError('user already exists', 409);
  }

  password = hashSync(password, 10);

  user = await prisma.user.create({
    data: {
      login,
      name,
      password,
      cpf,
      role,
      dash,
    },
  });

  return UserReturnSchema.parse(user);
};
