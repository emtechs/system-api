import { hashSync } from 'bcryptjs';
import { IUser } from '../../interfaces';
import prisma from '../../prisma';

const verifyUser = async ({
  cpf,
  dash,
  school_id,
  login,
  name,
  role,
}: IUser) => {
  const userData = await prisma.user.findUnique({ where: { login } });
  let user = userData;
  if (!userData) {
    const password = hashSync(login.substring(0, 6), 10);

    user = await prisma.user.create({
      data: {
        cpf,
        login,
        name,
        password,
        dash,
        role,
      },
    });
  }

  await prisma.school.update({
    where: { id: school_id },
    data: {
      director_id: user.id,
      servers: {
        upsert: {
          where: { school_id_server_id: { school_id, server_id: user.id } },
          create: { server_id: user.id, dash, role },
          update: { dash, role },
        },
      },
    },
  });

  return user;
};

export const importUser = async (users: IUser[]) => {
  const usersVerifyParse = users.map((el) => {
    return verifyUser(el);
  });
  return Promise.all(usersVerifyParse).then((user) => {
    return user;
  });
};
