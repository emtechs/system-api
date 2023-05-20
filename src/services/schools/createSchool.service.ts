import prisma from '../../prisma';
import { ISchoolRequest } from '../../interfaces';
import { SchoolReturnSchema } from '../../schemas';
import { hashSync } from 'bcryptjs';

export const createSchoolService = async ({
  name,
  login,
  cpf,
  name_diret,
  password,
  role,
  dash,
}: ISchoolRequest) => {
  let user = await prisma.user.findUnique({
    where: { login },
  });
  if (user) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { is_active: true, role, dash },
    });
  } else {
    password = hashSync(password, 10);
    user = await prisma.user.create({
      data: { cpf, login, name: name_diret, password, dash, role },
    });
  }

  const school = await prisma.school.create({
    data: {
      name,
      director_id: user.id,
      servers: { create: { server_id: user.id, dash: 'SCHOOL' } },
    },
  });

  return SchoolReturnSchema.parse(school);
};
