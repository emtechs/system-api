import prisma from '../../prisma';

export const classYearReturn = async (
  class_id: string,
  school_id: string,
  year_id: string,
) => {
  let infrequency = 0;

  const [classData, school, students, frequencies, infreqData, { key }] =
    await Promise.all([
      prisma.class.findUnique({
        where: { id: class_id },
        select: { id: true, name: true },
      }),
      prisma.school.findUnique({
        where: { id: school_id },
        select: { id: true, name: true },
      }),
      prisma.student.count({
        where: {
          classes: { some: { class_id, school_id, year_id, is_active: true } },
        },
      }),
      prisma.frequency.count({
        where: { class_id, school_id, year_id, status: 'CLOSED' },
      }),
      prisma.classYearInfrequency.findFirst({
        where: { class_id, school_id, year_id, period: { category: 'ANO' } },
        select: { value: true },
      }),
      prisma.classYear.findUnique({
        where: { class_id_school_id_year_id: { class_id, school_id, year_id } },
        select: { key: true },
      }),
    ]);

  if (infreqData) infrequency = infreqData.value;

  return {
    ...classData,
    label: classData.name,
    school,
    students,
    frequencies,
    infrequency,
    year_id,
    key,
  };
};

export const classYearArrayReturn = async (
  classData: {
    class_id: string;
    school_id: string;
    year_id: string;
  }[],
) => {
  const classes = classData.map((el) => {
    const { class_id, school_id, year_id } = el;

    return classYearReturn(class_id, school_id, year_id);
  });

  return Promise.all(classes).then((school) => {
    return school;
  });
};
