import { hashSync } from 'bcryptjs';
import { ISchoolUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateSchoolService = async (
  {
    is_active,
    cpf,
    dash,
    login,
    name,
    name_diret,
    password,
    role,
  }: ISchoolUpdateRequest,
  id: string,
) => {
  if (login) {
    let user = await prisma.user.findUnique({
      where: { login },
    });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          is_active: true,
          role,
          dash,
        },
      });
    } else {
      password = hashSync(password, 10);
      user = await prisma.user.create({
        data: { cpf, login, name: name_diret, password, dash, role },
      });
    }

    const school = await prisma.school.update({
      where: { id },
      data: {
        director_id: user.id,
        servers: { create: { server_id: user.id } },
      },
    });

    return school;
  }

  const school = await prisma.school.update({
    where: { id },
    data: { name, is_active },
  });

  return school;
};
