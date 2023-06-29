import { AppError } from '../../errors';
import prisma from '../../prisma';
import { schoolClassReturn } from '../../scripts';

export const retrieveSchoolClassService = async (
  school_id: string,
  year_id: string,
) => {
  const schoolFind = await prisma.classSchool.findFirst({
    where: { school_id, year_id },
  });

  if (!schoolFind) throw new AppError('school not found', 404);

  const element = await prisma.classSchool.findFirst({
    where: { year_id, school_id },
    select: {
      school: {
        select: {
          id: true,
          name: true,
          is_active: true,
          director: { select: { id: true, name: true, cpf: true } },
          infrequencies: {
            where: { period: { year_id, category: 'ANO' } },
            select: { value: true },
          },
          _count: {
            select: { classes: { where: { year_id } }, servers: true },
          },
        },
      },
      _count: {
        select: {
          frequencies: { where: { status: 'CLOSED', year_id } },
          students: { where: { is_active: true, year_id } },
        },
      },
    },
  });

  return schoolClassReturn(element);
};
