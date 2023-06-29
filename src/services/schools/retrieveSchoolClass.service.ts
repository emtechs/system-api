import { AppError } from '../../errors';
import prisma from '../../prisma';

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
          director_id: true,
          director: { select: { name: true, cpf: true } },
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

  let director = { id: '', name: '', cpf: '' };
  let infrequency = 0;

  if (element.school.director)
    director = {
      id: element.school.director_id,
      name: element.school.director.name,
      cpf: element.school.director.cpf,
    };

  if (element.school.infrequencies.length > 0)
    infrequency = element.school.infrequencies[0].value;

  return {
    id: element.school.id,
    label: element.school.name,
    name: element.school.name,
    director,
    classes: element.school._count.classes,
    students: element._count.students,
    frequencies: element._count.frequencies,
    servers: element.school._count.servers,
    infrequency,
  };
};
