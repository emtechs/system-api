import prisma from '../../prisma';
import { IUserCreateQuery, IUserRequest } from '../../interfaces';
import { hashSync } from 'bcryptjs';
import { AppError } from '../../errors';
import { UserReturnSchema } from '../../schemas';

export const createUserService = async (
  { login, name, password, cpf, role, dash }: IUserRequest,
  { school_id }: IUserCreateQuery,
) => {
  let user = await prisma.user.findUnique({
    where: { login },
  });

  if (school_id) {
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
  }

  if (user) {
    throw new AppError('user already exists', 409);
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
    include: {
      director_school: true,
      work_school: {
        include: {
          school: {
            include: {
              frequencies: {
                include: {
                  class: true,
                  students: { include: { student: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  return UserReturnSchema.parse(user);
};
