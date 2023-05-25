import prisma from '../../prisma';
import { IUserCreateQuery, IUserRequest } from '../../interfaces';
import { hashSync } from 'bcryptjs';
import { AppError } from '../../errors';
import { UserReturnSchema } from '../../schemas';

export const createUserService = async (
  { login, name, password, cpf, role, dash }: IUserRequest,
  { school_id, allNotServ }: IUserCreateQuery,
) => {
  let user = await prisma.user.findUnique({
    where: { login },
  });

  if (school_id) {
    if (user) {
      const server = await prisma.user.update({
        where: { id: user.id },
        data: {
          is_active: true,
          dash,
          work_school: {
            upsert: {
              where: { school_id_server_id: { school_id, server_id: user.id } },
              create: { school_id, dash },
              update: { dash },
            },
          },
        },
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
