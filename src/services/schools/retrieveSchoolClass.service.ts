import prisma from '../../prisma';

export const retrieveSchoolClassService = async (
  school_id: string,
  year_id: string,
) => {
  const element = await prisma.classSchool.findFirst({
    where: { year_id, school_id },
    select: {
      school: {
        select: {
          id: true,
          name: true,
          director_id: true,
          director: { select: { name: true } },
          infrequencies: {
            where: { period: { year_id, category: 'ANO' } },
            select: { value: true },
          },
          _count: { select: { classes: { where: { year_id } } } },
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

  let director = '';
  let infrequency = 0;

  if (element.school.director) director = element.school.director.name;

  if (element.school.infrequencies.length > 0)
    infrequency = element.school.infrequencies[0].value;

  return {
    id: element.school.id,
    name: element.school.name,
    director_id: element.school.director_id,
    director,
    classes: element.school._count.classes,
    students: element._count.students,
    frequencies: element._count.frequencies,
    infrequency,
  };
};
