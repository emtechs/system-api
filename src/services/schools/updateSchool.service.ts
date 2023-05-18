import { ISchoolUpdateRequest } from '../../interfaces';
import prisma from '../../prisma';

export const updateSchoolService = async (
  { is_active }: ISchoolUpdateRequest,
  id: string,
) => {
  const school = await prisma.school.update({
    where: { id },
    data: { is_active },
    include: {
      director: true,
      servers: { include: { server: true } },
      frequencies: {
        include: { class: true, students: { include: { student: true } } },
      },
    },
  });

  return school;
};
