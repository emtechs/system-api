import prisma from '../../prisma';

export const dashUserService = async (year_id: string) => {
  const [
    countSchool,
    countClass,
    countStudent,
    countFrequency,
    countServer,
    countNotClass,
  ] = await Promise.all([
    prisma.school.count({ where: { is_active: true } }),
    prisma.classSchool.count({ where: { year_id } }),
    prisma.classStudent.count({
      where: { class_school: { class: { is_active: true } } },
    }),
    prisma.frequency.count({
      where: { AND: { year_id, status: 'CLOSED' } },
    }),
    prisma.user.count({
      where: {
        AND: { role: { not: { in: ['ADMIN', 'SECRET'] } }, is_active: true },
      },
    }),
    prisma.student.count({
      where: { classes: { every: { is_active: false } } },
    }),
  ]);

  return {
    countSchool,
    countClass,
    countStudent,
    countFrequency,
    countServer,
    countNotClass,
  };
};
