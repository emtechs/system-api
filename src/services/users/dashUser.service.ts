import prisma from '../../prisma';

export const dashUserService = async (year_id: string) => {
  const countSchool = await prisma.school.count({ where: { is_active: true } });

  const countClass = await prisma.classSchool.count({ where: { year_id } });

  const countStudent = await prisma.classStudent.count({
    where: { class: { class: { is_active: true } } },
  });

  const countFrequency = await prisma.frequency.count({
    where: { AND: { year_id, status: 'CLOSED' } },
  });

  const countServer = await prisma.user.count({
    where: {
      AND: { role: { not: { in: ['ADMIN', 'SECRET'] } }, is_active: true },
    },
  });

  const countNotClass = await prisma.student.count({
    where: { classes: { every: { is_active: false } } },
  });

  return {
    countSchool,
    countClass,
    countStudent,
    countFrequency,
    countServer,
    countNotClass,
  };
};
