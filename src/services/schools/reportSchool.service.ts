import prisma from '../../prisma';

export const reportSchoolService = async (
  school_id: string,
  year_id: string,
) => {
  const [classesData, monthsData, studentsData] = await Promise.all([
    prisma.class.findMany({
      where: {
        schools: {
          some: {
            school_id,
            year_id,
            frequencies: { some: { status: 'CLOSED' } },
          },
        },
      },
      select: { id: true, name: true },
    }),
    prisma.month.findMany({
      where: { frequencies: { some: { school_id, year_id } } },
      select: { id: true, name: true },
      orderBy: { month: 'asc' },
    }),
    prisma.student.findMany({
      where: {
        classes: { some: { school_id, year_id } },
        infrequencies: { some: { frequencies: { gt: 0 } } },
      },
      select: { id: true, registry: true, name: true },
    }),
  ]);

  const classes = classesData.map((el) => {
    return { ...el, label: el.name };
  });

  const months = monthsData.map((el) => {
    return { ...el, label: el.name };
  });

  const students = studentsData.map((el) => {
    return { ...el, label: el.name };
  });

  return { classes, months, students };
};
